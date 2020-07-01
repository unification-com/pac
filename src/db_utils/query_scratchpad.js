require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
const {mongoDbUrl} = require('../common/utils');
const PAC_CONFIG = require('../common/constants');

// Create a new MongoClient
const client = new MongoClient(mongoDbUrl(true));

const runQuery = async () => {
    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DBNAME);
        const collection = db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
        const ipfsCollection = db.collection(PAC_CONFIG.IPFS_HISTORY_COLLECTION);

        // let ipfsSubmits = await ipfsCollection.find().sort({timestamp: -1}).toArray();
        // console.log(ipfsSubmits)

        // console.log("cross references");
        // let crossReferences = await collection.find({
        //     hasCrossReferences: true,
        // }).toArray();
        //
        // for(let cr of crossReferences) {
        //     console.log(cr.source);
        //     console.log(cr.crossReferences);
        // }

        // let beaconsSubmitted = await collection.find({
        //     beaconTimestampId: {$gt: 0},
        // }).toArray();
        // for(let b of beaconsSubmitted) {
        //     console.log(b.beaconTimestampId, ":", b.beaconHash);
        // }

        // await collection.updateMany(
        //     {},
        //     {$set: {addedToMerkleTree: false}});

        // let beaconsMerkled = await collection.find({
        //     addedToMerkleTree: true
        // }).toArray();
        // for(let b of beaconsMerkled) {
        //     console.log( b.beaconHash);
        // }
        // console.log(beaconsMerkled.length, "merkled");
        //

        let sources = await collection.distinct( 'source' );
        console.log(sources);

        let numRows = await collection.find({}).count();

        console.log("total rows:", numRows);

    } catch (err) {
        console.log(err.stack);
    }

    process.exit(1);
}

runQuery();
