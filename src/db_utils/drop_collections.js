require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const {mongoDbUrl} = require('../common/utils');

MongoClient.connect(mongoDbUrl(true), function(err, db) {
    if (err) throw err;
    db.close();
});

MongoClient.connect(mongoDbUrl(true), function(err, db) {
    if (err) throw err;
    let dbo = db.db(process.env.MONGODB_DBNAME);
    dbo.collection("incident_reports").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
        dbo.collection("merkle_tree").drop(function(err, delOK) {
            if (err) throw err;
            if (delOK) console.log("Collection deleted");
            db.close();
        });
    });
});