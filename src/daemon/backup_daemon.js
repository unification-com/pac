const fs = require('fs');

const {dbBackUp} = require('../db_utils/backup');

class BackupDaemon {
    constructor() {
    }

    async backupDb() {
        console.log("run DB backup")
        dbBackUp(function(backupDir) {
            if(fs.existsSync(backupDir)) {
                console.log("BACKUP SUCCESS. Location:", backupDir);
            }
        });
        // Todo - implement save to IPFS
    }
}

module.exports = BackupDaemon;
