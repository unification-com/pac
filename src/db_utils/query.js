const MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');

// Connection URL
const mongoUrl = 'mongodb://localhost:27017';

// Database Name
const dbName = 'pac';
const collectionName = 'incident_reports';

// Create a new MongoClient
const client = new MongoClient(mongoUrl);

const runQuery = async () => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

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
        //     beaconTimestampId: 0// {$gt: 0},
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
        // let numRows = await collection.find({}).count();

        // console.log("total rows:", numRows);

        // let checkCr = await collection.find({
        //     _id: new mongo.ObjectID("5ee24d424d3cfb7f218ffff6"),
        // }).toArray();
        //
        // console.log(checkCr[0]);

    } catch (err) {
        console.log(err.stack);
    }

    process.exit(1);
}

runQuery();
