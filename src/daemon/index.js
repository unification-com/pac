require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

// sub daemons
const DataDaemon = require('./data_daemon')
const BeaconDaemon = require('./beacon_daemon')
const MerkleDaemon = require('./merkle_daemon')
const BackupDaemon = require('./backup_daemon')

// specific functions
const {mongoDbUrl} = require('../common/utils');
const PAC_CONFIG = require('../common/constants');

// Create a new MongoClient
const mongoClient = new MongoClient(mongoDbUrl(true));

const runDaemon = async () => {

    let args = process.argv.slice(2);
    let daemon = args[0];
    await mongoClient.connect();

    console.log("run daemon:", daemon)

    switch(daemon) {
        case 'data':
            const dataDaemon = new DataDaemon(mongoClient);
            dataDaemon.runDbUpdates();
            let dbUpdateFrequency = process.env.DB_UPDATE_FREQUENCY || PAC_CONFIG.DEFAULT_UPDATE_FREQUENCY;
            if (dbUpdateFrequency < PAC_CONFIG.DEFAULT_UPDATE_FREQUENCY) {
                dbUpdateFrequency = PAC_CONFIG.DEFAULT_UPDATE_FREQUENCY;
            }
            setInterval(() => dataDaemon.runDbUpdates(), dbUpdateFrequency);
            break
        case 'beacon':
            const beaconDaemon = new BeaconDaemon(mongoClient);
            beaconDaemon.submitBeaconHashes();
            let beaconUpdateFrequency = (process.env.BEACON_SUBMIT_IN_BATCH || PAC_CONFIG.DEFAULT_BEACON_SUBMIT_IN_BATCH) * 30 * 1000;
            setInterval(() => beaconDaemon.submitBeaconHashes(), beaconUpdateFrequency);
            break
        case 'merkle':
            const merkleDaemon = new MerkleDaemon(mongoClient);
            merkleDaemon.generateMerkleTree();
            let merkleUpdateFrequency = (process.env.BEACON_SUBMIT_IN_BATCH || PAC_CONFIG.DEFAULT_BEACON_SUBMIT_IN_BATCH) * 30 * 1000;
            merkleUpdateFrequency = merkleUpdateFrequency + 1000 // extra second
            setInterval(() => merkleDaemon.generateMerkleTree(), merkleUpdateFrequency);
            break
        case 'backup':
            const backupDaemon = new BackupDaemon(mongoClient);
            backupDaemon.backupDb()
            let dbBackupFrequency = (process.env.DB_BACKUP_FREQUENCY || PAC_CONFIG.DEFAULT_DB_BACKUP_FREQUENCY) * 1000;
            setInterval(() => backupDbToIpfs(), dbBackupFrequency);
            break
        default:
            console.log("unknown daemon", daemon)
            break
    }
};

runDaemon();
