require('dotenv').config();

const assert = require('assert').strict;
const merkle_mod = require('merkle-tree');
const UndClient = require('@unification-com/und-js');

// Common classes
const IncidentReport = require('../common/incident_report.js');
const MerkleTree = require('../common/merkle_tree');

const PAC_CONFIG = require('../common/constants');

class MerkleDaemon {
    constructor(_mongoClient) {
        this.mongoClient = _mongoClient;
        this.undClient = null;
    }

    async getUndClient() {
        const undClient = new UndClient(process.env.MAINCHAIN_REST)
        await undClient.initChain()
        undClient.setBroadcastMode("block")
        await undClient.setPrivateKey(process.env.BEACON_OWNER_PK)
        // use default delegates (signing, broadcast)
        undClient.useDefaultSigningDelegate()
        undClient.useDefaultBroadcastDelegate()
        this.undClient = undClient
    }

    async saveMerkleToDb(rootHash) {
        const db = this.mongoClient.db(process.env.MONGODB_DBNAME);
        const collection = db.collection(PAC_CONFIG.MERKLE_TREE_COLLECTION);
        await this.getUndClient();
        const now = new Date();
        const timestamp = Math.round(now.getTime() / 1000);

        let subRes = await this.undClient.recordBeaconTimestamp(
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

    async generateMerkleTree() {
        const db = this.mongoClient.db(process.env.MONGODB_DBNAME);
        const collection = db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
        let self = this;

        let config = new merkle_mod.Config({N: 256, M: 256});
        let myTree = new MerkleTree(config);

        let beaconsForMerkle = await collection.find({
            beaconTimestampId: {$gt: 0},
        }).sort({beaconTimestampId: 1}).toArray();

        let numHashes = beaconsForMerkle.length;
        console.log("generate tree from", numHashes, "submitted beacon hashes")
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
                        self.saveMerkleToDb(new_root_hash);
                    }
                });
            });
        }
    }
}

module.exports = MerkleDaemon;
