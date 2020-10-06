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
            break
        case 'beacon':
            const beaconDaemon = new BeaconDaemon(mongoClient);
            beaconDaemon.submitBeaconHashes();
            break
        case 'merkle':
            const merkleDaemon = new MerkleDaemon(mongoClient);
            merkleDaemon.generateMerkleTree();
            break
        case 'backup':
            const backupDaemon = new BackupDaemon(mongoClient);
            backupDaemon.backupDb()
            break
        default:
            console.log("unknown daemon", daemon)
            break
    }
};

runDaemon();
