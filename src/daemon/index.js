require('dotenv').config();

const assert = require('assert').strict;
const fs = require('fs');
const merkle_mod = require('merkle-tree');
const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');
const UndClient = require('@unification-com/und-js');

// APIs & Data sources
const PoliceBrutality2020 = require('./apis/2020pb');
const FatalEncountersDotOrg = require('./apis/fatal_encounters');
const GuardianTheCounted = require('./apis/guardian_the_counted');
const KilledByPolice = require('./apis/killed_by_police');
const MappingPoliceViolence = require('./apis/mapping_police_violence');
const USPoliceShootings = require('./apis/us_police_shootings');
const WashingtonPost = require('./apis/washington_post');

// Common classes
const IncidentReport = require('../common/incident_report.js');
const MerkleTree = require('../common/merkle_tree');

// specific functions
const {dbBackUp} = require('../db_utils/backup');
const {mongoDbUrl, sleepFor} = require('../common/utils');
const PAC_CONFIG = require('../common/constants');

// Create a new MongoClient
const mongoClient = new MongoClient(mongoDbUrl(true));

let BEACON_UPDATE_RUNNING = false;
let DB_UPDATE_RUNNING = false;

const getUndClient = async () => {
    const undClient = new UndClient(process.env.MAINCHAIN_REST)
    await undClient.initChain()
    undClient.setBroadcastMode("block")
    await undClient.setPrivateKey(process.env.BEACON_OWNER_PK)
    // use default delegates (signing, broadcast)
    undClient.useDefaultSigningDelegate()
    undClient.useDefaultBroadcastDelegate()
    return undClient
}

const runDbUpdates = async () => {

    if (DB_UPDATE_RUNNING) {
        console.log("DB update already in progress");
        return;
    }
    DB_UPDATE_RUNNING = true;

    const start = new Date();

    // ToDo - remove limit
    let API_LIMIT = -1;

    let pb = new PoliceBrutality2020(mongoClient, API_LIMIT);
    let wp = new WashingtonPost(mongoClient, API_LIMIT);
    let fe = new FatalEncountersDotOrg(mongoClient, API_LIMIT);
    let kbp = new KilledByPolice(mongoClient, API_LIMIT);
    let usps = new USPoliceShootings(mongoClient, API_LIMIT);
    let mpv = new MappingPoliceViolence(mongoClient, API_LIMIT);
    let gtc = new GuardianTheCounted(mongoClient, API_LIMIT);

    Promise.all([
        pb.run(),
        wp.run(),
        fe.run(),
        kbp.run(),
        usps.run(),
        mpv.run(),
        gtc.run()
    ]).then((values) => {
        console.log("pbUpRes", values[0]);
        console.log("wpUpRes", values[1]);
        console.log("feUpRes", values[2]);
        console.log("kbpUpRes", values[3]);
        console.log("uspsUpRes", values[4]);
        console.log("mpvUpRes", values[5]);
        console.log("gtcUpRes", values[6]);

        DB_UPDATE_RUNNING = false;

        const end = new Date();

        const timeTaken = (end.getTime() - start.getTime()) / 1000;

        console.log("api updates complete in ", timeTaken, "seconds");
    }).catch(function (err) {
        console.error(err);

        DB_UPDATE_RUNNING = false;
    });
};

const submitBeaconHashes = async () => {

    if (process.env.BEACON_OWNER_ADDRESS === '' || process.env.BEACON_ID === '' || process.env.BEACON_OWNER_PK === '') {
        console.log("BEACON vars not set. Skip hash submission");
        BEACON_UPDATE_RUNNING = false;
        return;
    }

    if (BEACON_UPDATE_RUNNING) {
        console.log("BEACON update already in progress");
        return;
    }
    BEACON_UPDATE_RUNNING = true;

    const db = mongoClient.db(process.env.MONGODB_DBNAME);
    const collection = db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION);

    console.log("timestamps to submit");

    let batchLimit = parseInt((process.env.BEACON_SUBMIT_IN_BATCH || PAC_CONFIG.DEFAULT_BEACON_SUBMIT_IN_BATCH));

    let beaconsToSubmit = await collection.find({
        beaconTimestampId: 0,
    }).limit(batchLimit).toArray();

    const undClient = await getUndClient();

    for (let b of beaconsToSubmit) {
        console.log("record BEACON hash", b.beaconHash);
        const now = new Date();
        const timestamp = Math.round(now.getTime() / 1000);
        try {
            let subRes = await undClient.recordBeaconTimestamp(
                process.env.BEACON_ID,
                b.beaconHash,
                timestamp
            );

            if ('data' in subRes.result && 'height' in subRes.result) {
                let txHash = subRes.result.txhash;
                let mcHeight = subRes.result.height;
                let tsId = subRes.result.data;
                let tsIdInt = parseInt(tsId, 16);

                if (tsIdInt > 0) {
                    console.log("BEACON SUBMIT SUCCESS");
                    console.log("txHash", txHash, "height", mcHeight, "tsId", tsId, "parseInt(tsId)", tsIdInt);

                    console.log("update database _id:", b._id);
                    // ToDo - handle update error
                    var dbRes = await collection.updateOne(
                        {_id: new mongo.ObjectID(b._id)},
                        {
                            $set: {
                                beaconTimestamp: timestamp,
                                beaconTimestampId: tsIdInt,
                                mainchainTxHash: txHash,
                                mainchainBlockHeight: mcHeight,
                                addedToMerkleTree: false,
                            }
                        });
                }
            }
        } catch (err) {
            console.log("FAILED TO SUBMIT BEACON HASH");
            BEACON_UPDATE_RUNNING = false;
            console.log(err)
        }
        console.log("wait a second...")
        await sleepFor(1000);
    }
    console.log("BEACON batch done. Run Merkle tree.")
    BEACON_UPDATE_RUNNING = false;
    await generateMerkleTree();
}

const saveMerkleToDb = async (rootHash) => {
    const db = mongoClient.db(process.env.MONGODB_DBNAME);
    const collection = db.collection(PAC_CONFIG.MERKLE_TREE_COLLECTION);
    const undClient = await getUndClient();
    const now = new Date();
    const timestamp = Math.round(now.getTime() / 1000);

    let subRes = await undClient.recordBeaconTimestamp(
        process.env.BEACON_ID,
        rootHash,
        timestamp
    );

    if ('data' in subRes.result && 'height' in subRes.result) {
        let txHash = subRes.result.txhash;
        let mcHeight = subRes.result.height;
        let tsId = subRes.result.data;
        let tsIdInt = parseInt(tsId, 16);
        let merkleTree = {
            rootHash: rootHash,
            beaconTimestampId: 0,
            mainchainTxHash: '',
            mainchainBlockHeight: 0,
            beaconTimestamp: timestamp,
        }
        if (tsIdInt > 0) {
            console.log("BEACON SUBMIT SUCCESS");
            console.log("txHash", txHash, "height", mcHeight, "tsId", tsId, "parseInt(tsId)", tsIdInt);
            merkleTree.beaconTimestampId = tsIdInt;
            merkleTree.mainchainTxHash = txHash;
            merkleTree.mainchainBlockHeight = mcHeight;
        }

        let res = await collection.insertOne(merkleTree);
        console.log("merkleTree", merkleTree);
    }
}

const generateMerkleTree = async () => {

    const db = mongoClient.db(process.env.MONGODB_DBNAME);
    const collection = db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION);

    let config = new merkle_mod.Config({N: 256, M: 256});
    let myTree = new MerkleTree(config);

    let beaconsForMerkle = await collection.find({
        beaconTimestampId: {$gt: 0},
    }).sort({beaconTimestampId: 1}).toArray();

    let numHashes = beaconsForMerkle.length;
    let i = 0;
    for (let b of beaconsForMerkle) {
        let ir = new IncidentReport();
        ir.loadFromDb(b);
        assert.equal(b.beaconHash, ir.hash());
        myTree.upsert({'key': ir.hash(), 'val': ir.getDataToHash(true)}, function (err, new_root_hash) {
            myTree.find({'key': ir.hash(), 'skip_verify': false}, function (err, val2) {
                i++;
                assert.equal(ir.getDataToHash(true), val2);
                collection.updateOne(
                    {beaconHash: ir.hash()},
                    {$set: {addedToMerkleTree: true}});
                if (i === numHashes) {
                    saveMerkleToDb(new_root_hash);
                }
            });
        });
    }
}

const backupDbToIpfs = async () => {

    console.log("run DB backup")
    dbBackUp(function(backupDir) {
        if(fs.existsSync(backupDir)) {
            console.log("BACKUP SUCCESS. Location:", backupDir);
        }
    });
    // Todo - implement save to IPFS
}

const runDaemon = async () => {
    await mongoClient.connect();

    runDbUpdates();
    submitBeaconHashes();

    let dbUpdateFrequency = process.env.DB_UPDATE_FREQUENCY || PAC_CONFIG.DEFAULT_UPDATE_FREQUENCY;
    if (dbUpdateFrequency < PAC_CONFIG.DEFAULT_UPDATE_FREQUENCY) {
        dbUpdateFrequency = PAC_CONFIG.DEFAULT_UPDATE_FREQUENCY;
    }
    let beaconUpdateFrequency = (process.env.BEACON_SUBMIT_IN_BATCH || PAC_CONFIG.DEFAULT_BEACON_SUBMIT_IN_BATCH) * 7 * 1000;
    setInterval(() => runDbUpdates(), dbUpdateFrequency);
    setInterval(() => submitBeaconHashes(), beaconUpdateFrequency);

    let dbBackupFrequency = (process.env.DB_BACKUP_FREQUENCY || PAC_CONFIG.DEFAULT_DB_BACKUP_FREQUENCY) * 1000;
    setInterval(() => backupDbToIpfs(), dbBackupFrequency);
};

runDaemon();
