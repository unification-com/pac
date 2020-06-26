require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const {mongoDbUrl} = require('../common/utils');

const PAC_CONFIG = require('../common/constants');

// create database
MongoClient.connect(mongoDbUrl(true), function(err, db) {
    if (err) throw err;
    console.log(process.env.MONGODB_DBNAME, "database created!");
    let dbo = db.db(process.env.MONGODB_DBNAME);
    dbo.createCollection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION, { 'collation' : { 'locale' : 'en' } }, function(err, res) {
        if (err) throw err;
        console.log("Collection created!", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
        dbo.createCollection(PAC_CONFIG.MERKLE_TREE_COLLECTION, {capped: true, size:999999, max:1}, async function(err, res) {
            if (err) throw err;
            console.log("Collection created!", PAC_CONFIG.MERKLE_TREE_COLLECTION);

            dbo.createCollection(PAC_CONFIG.IPFS_HISTORY_COLLECTION, { 'collation' : { 'locale' : 'en' } }, async function(err, res) {
                if (err) throw err;
                console.log("Collection created!", PAC_CONFIG.IPFS_HISTORY_COLLECTION);

                // create indexes
                const ir_collection = await dbo.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                console.log("create sourceDatetime index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ sourceDatetime: 1 }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create locationStateCode index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ locationStateCode: 1 }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create beaconHash index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ beaconHash: 1 }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create source index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ source: 1 }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create locationStateCode, locationCity index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ locationStateCode: 1, locationCity: 1 }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create victimRace index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ victimRace: 1 }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create victimAge index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ victimAge: 1 }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create victimGender index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ victimGender: 1 }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create victimArmed index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ victimArmed: 1 }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create victimName index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ victimName: "text" }, {collation: {locale: "simple"} } );
                console.log("done");

                console.log("create year index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ year: 1 }, {collation: {locale: "en"} } );
                console.log("done");

                console.log("create year month on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ month: 1 }, {collation: {locale: "en"} } );
                console.log("done");

                console.log("create source month on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ source: 1 }, {collation: {locale: "en"} } );
                console.log("done");

                console.log("create locationStateCode, victimRace, victimAge, victimGender index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1, victimAge: 1, victimGender: 1  }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create locationStateCode, victimRace index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1  }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create locationStateCode, victimAge index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ locationStateCode: 1, victimAge: 1  }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create locationStateCode, victimRace, victimAge, victimGender, victimArmed index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1, victimAge: 1, victimGender: 1, victimArmed: 1  }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create locationStateCode, victimRace, victimAge, victimGender, victimArmed, year, month index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1, victimAge: 1, victimGender: 1, victimArmed: 1, year: 1, month: 1  }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create locationStateCode, victimRace, victimAge, victimGender, victimArmed, year, month, source index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ locationStateCode: 1, victimRace: 1, victimAge: 1, victimGender: 1, victimArmed: 1, year: 1, month: 1, source: 1  }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create addedToMerkleTree index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ addedToMerkleTree: 1  }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create beaconTimestampId index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ beaconTimestampId: 1  }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create beaconTimestampId, addedToMerkleTree index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ beaconTimestampId: 1, addedToMerkleTree: 1  }, { collation: { locale: "en" } });
                console.log("done");

                console.log("create beaconHash, addedToMerkleTree index on", PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
                await ir_collection.createIndex({ beaconHash: 1, addedToMerkleTree: 1  }, { collation: { locale: "en" } });
                console.log("done");

                const ipfs_collection = await dbo.collection(PAC_CONFIG.IPFS_HISTORY_COLLECTION);
                console.log("create timestamp index on", PAC_CONFIG.IPFS_HISTORY_COLLECTION);
                await ipfs_collection.createIndex({ timestamp: 1 }, { collation: { locale: "en" } });
                console.log("done");

                db.close();
            });
        });
    });
});
