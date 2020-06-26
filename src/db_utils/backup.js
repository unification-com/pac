require('dotenv').config()
const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;

/* return if variable is empty or not. */
const empty = (mixedVar) => {
    let key, i, len;
    let emptyValues = [undefined, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            return false;
        }
        return true;
    }
    return false;
};

// Auto backup script
module.exports.dbBackUp = (backupPath = './data/backup/pac_mongodb_backup', cb = function () {
}) => {
    let cmd = 'mongodump --host ' + process.env.MONGODB_HOST + ' --port ' + process.env.MONGODB_PORT + ' --db ' + process.env.MONGODB_DBNAME + ' --username ' + process.env.MONGODB_DBUSER + ' --password ' + process.env.MONGODB_DBPASS + ' --out ' + backupPath; // Command for mongodb dump process
    exec(cmd, function (error) {
        if (empty(error)) {
            cb(backupPath);
        } else {
            console.log("Backup error");
        }
    });
}
