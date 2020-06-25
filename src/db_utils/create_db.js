require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const {mongoDbUrl} = require('../common/utils');

// Database Name
const incidentReportCollectionName = 'incident_reports';
const merkleTreeCollectionName = 'merkle_tree';

// create database
MongoClient.connect(mongoDbUrl(true), function(err, db) {
    if (err) throw err;
    console.log(process.env.MONGODB_DBNAME, "database created!");
    let dbo = db.db(process.env.MONGODB_DBNAME);
    dbo.createCollection(incidentReportCollectionName, { 'collation' : { 'locale' : 'en' } }, function(err, res) {
        if (err) throw err;
        console.log("Collection created!", incidentReportCollectionName);
        dbo.createCollection(merkleTreeCollectionName, {capped: true, size:999999, max:1}, async function(err, res) {
            if (err) throw err;
            console.log("Collection created!", merkleTreeCollectionName);

            // create indexes
            const ir_collection = await dbo.collection(incidentReportCollectionName);
            console.log("create sourceDatetime index on", incidentReportCollectionName);
            await ir_collection.createIndex({ sourceDatetime: 1 }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create locationStateCode index on", incidentReportCollectionName);
            await ir_collection.createIndex({ locationStateCode: 1 }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create beaconHash index on", incidentReportCollectionName);
            await ir_collection.createIndex({ beaconHash: 1 }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create source index on", incidentReportCollectionName);
            await ir_collection.createIndex({ source: 1 }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create locationStateCode, locationCity index on", incidentReportCollectionName);
            await ir_collection.createIndex({ locationStateCode: 1, locationCity: 1 }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create victimRace index on", incidentReportCollectionName);
            await ir_collection.createIndex({ victimRace: 1 }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create victimAge index on", incidentReportCollectionName);
            await ir_collection.createIndex({ victimAge: 1 }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create victimGender index on", incidentReportCollectionName);
            await ir_collection.createIndex({ victimGender: 1 }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create victimArmed index on", incidentReportCollectionName);
            await ir_collection.createIndex({ victimArmed: 1 }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create victimName index on", incidentReportCollectionName);
            await ir_collection.createIndex({ victimName: "text" }, {collation: {locale: "simple"} } );
            console.log("done");

            console.log("create year index on", incidentReportCollectionName);
            await ir_collection.createIndex({ year: 1 }, {collation: {locale: "en"} } );
            console.log("done");

            console.log("create year month on", incidentReportCollectionName);
            await ir_collection.createIndex({ month: 1 }, {collation: {locale: "en"} } );
            console.log("done");

            console.log("create source month on", incidentReportCollectionName);
            await ir_collection.createIndex({ source: 1 }, {collation: {locale: "en"} } );
            console.log("done");

            console.log("create locationStateCode, victimRace, victimAge, victimGender index on", incidentReportCollectionName);
            await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1, victimAge: 1, victimGender: 1  }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create locationStateCode, victimRace index on", incidentReportCollectionName);
            await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1  }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create locationStateCode, victimAge index on", incidentReportCollectionName);
            await ir_collection.createIndex({ locationStateCode: 1, victimAge: 1  }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create locationStateCode, victimRace, victimAge, victimGender, victimArmed index on", incidentReportCollectionName);
            await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1, victimAge: 1, victimGender: 1, victimArmed: 1  }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create locationStateCode, victimRace, victimAge, victimGender, victimArmed, year, month index on", incidentReportCollectionName);
            await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1, victimAge: 1, victimGender: 1, victimArmed: 1, year: 1, month: 1  }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create locationStateCode, victimRace, victimAge, victimGender, victimArmed, year, month, source index on", incidentReportCollectionName);
            await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1, victimAge: 1, victimGender: 1, victimArmed: 1, year: 1, month: 1, source: 1  }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create addedToMerkleTree index on", incidentReportCollectionName);
            await ir_collection.createIndex({ addedToMerkleTree: 1  }, { collation: { locale: "en" } });
            console.log("done");

            console.log("create beaconHash, addedToMerkleTree index on", incidentReportCollectionName);
            await ir_collection.createIndex({ beaconHash: 1, addedToMerkleTree: 1  }, { collation: { locale: "en" } });
            console.log("done");

            db.close();
        });
    });
});
