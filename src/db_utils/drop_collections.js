require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const mongoUrl = process.env.MONGODB_URL + '/' + process.env.MONGODB_DBNAME;

MongoClient.connect(mongoUrl, function(err, db) {
    if (err) throw err;
    db.close();
});

MongoClient.connect(mongoUrl, function(err, db) {
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