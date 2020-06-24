// Inspired by https://dzone.com/articles/auto-backup-mongodb-database-with-nodejs-on-server-1

require('dotenv').config()
const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const path = require("path");

const backupOptions =  {
    autoBackup: true,
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: './data/backup/',
    dbBackupPrefix: 'mongodb_backup-',
};

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

const removeDir = function(rmPath) {
    if (fs.existsSync(rmPath)) {
        const files = fs.readdirSync(rmPath)

        if (files.length > 0) {
            files.forEach(function(filename) {
                if (fs.statSync(rmPath + "/" + filename).isDirectory()) {
                    removeDir(rmPath + "/" + filename)
                } else {
                    fs.unlinkSync(rmPath + "/" + filename)
                }
            })
            fs.rmdirSync(rmPath)
        } else {
            fs.rmdirSync(rmPath)
        }
    } else {
        console.log("Directory", rmPath, "not found.")
    }
}

// Auto backup script
module.exports.dbBackUp = (cb = function() {}) => {
// check for auto backup is enabled or disabled
    if (backupOptions.autoBackup) {
        let date = new Date();
        let beforeDate, oldBackupDir, oldBackupPath;
        let newBackupDir = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        let newBackupPath = backupOptions.autoBackupPath + backupOptions.dbBackupPrefix + newBackupDir; // New backup path for current backup process
        // check for remove old backup after keeping # of days given in configuration
        if (backupOptions.removeOldBackup) {
            beforeDate = _.clone(date);
            beforeDate.setDate(beforeDate.getDate() - backupOptions.keepLastDaysBackup); // Subtract number of days to keep backup and remove old backup
            oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = backupOptions.autoBackupPath + backupOptions.dbBackupPrefix + oldBackupDir; // old backup(after keeping # of days)
        }
        let cmd = 'mongodump --host ' + process.env.MONGODB_HOST + ' --port ' + process.env.MONGODB_PORT + ' --db ' + process.env.MONGODB_DBNAME + ' --username ' + process.env.MONGODB_DBUSER + ' --password ' + process.env.MONGODB_DBPASS + ' --out ' + newBackupPath; // Command for mongodb dump process

        exec(cmd, function (error) {
            if (empty(error)) {
                // check for remove old backup after keeping # of days given in configuration
                if (backupOptions.removeOldBackup) {
                    if (fs.existsSync(oldBackupPath)) {
                        //exec("rm -rf " + oldBackupPath, function (err) { });
                        removeDir(oldBackupPath)
                    }
                }
                cb(newBackupPath);
            } else {
                console.log("Backup error");
            }
        });
    }
}
