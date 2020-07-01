require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const {mongoDbUrl} = require('../common/utils');
const PAC_CONFIG = require('../common/constants');

MongoClient.connect(mongoDbUrl(true), function(err, db) {
    if (err) throw err;
    db.close();
});

MongoClient.connect(mongoDbUrl(true), function(err, db) {
    if (err) throw err;
    let dbo = db.db(process.env.MONGODB_DBNAME);
    dbo.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log(PAC_CONFIG.INCIDENT_REPORT_COLLECTION, "Collection deleted");
        dbo.collection(PAC_CONFIG.MERKLE_TREE_COLLECTION).drop(function(err, delOK) {
            if (err) throw err;
            if (delOK) console.log(PAC_CONFIG.MERKLE_TREE_COLLECTION, "Collection deleted");
            dbo.collection(PAC_CONFIG.IPFS_HISTORY_COLLECTION).drop(function(err, delOK) {
                if (err) throw err;
                if (delOK) console.log(PAC_CONFIG.IPFS_HISTORY_COLLECTION, "Collection deleted");
                db.close();
            });
        });
    });
});