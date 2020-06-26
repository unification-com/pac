require('dotenv').config();
const fs = require('fs');
const IPFS = require('ipfs')
const tar = require('tar');

const {dbBackUp} = require('../db_utils/backup');

const PAC_CONFIG = require('../common/constants');

class BackupDaemon {
    constructor(_mongoClient) {
        this.mongoClient = _mongoClient;
        const db = this.mongoClient.db(process.env.MONGODB_DBNAME);
        this.collection = db.collection(PAC_CONFIG.IPFS_HISTORY_COLLECTION);
        this.ipfsNode = null
        this.backupToIPFS = (parseInt(process.env.BACKUP_TO_IPFS) || 0)
    }

    async backupDb() {
        console.log("run DB backup");
        if(this.backupToIPFS === 1) {
            this.ipfsNode = await IPFS.create()
        }
        let self = this;
        dbBackUp('./data/backup/pac_mongodb_backup', function (backupDir) {
            if (fs.existsSync(backupDir)) {
                console.log("BACKUP SUCCESS. Location:", backupDir);
                self.compressBackup(backupDir);
            }
        });
    }

    removeDir(rmPath) {
        let self = this;
        if (fs.existsSync(rmPath)) {
            const files = fs.readdirSync(rmPath)

            if (files.length > 0) {
                files.forEach(function(filename) {
                    if (fs.statSync(rmPath + "/" + filename).isDirectory()) {
                        self.removeDir(rmPath + "/" + filename)
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

    async compressBackup(backupDir) {

        let archiveFile = './data/backup/pac_backup.tar.gz';
        let self = this;
        tar.c(
            {
                portable: true,
                gzip: true,
                file: archiveFile
            },
            [backupDir]
        ).then(_ => {
            console.log("tarball created in ", archiveFile, ". Remove dir", backupDir)
            self.removeDir(backupDir)
            if(this.backupToIPFS === 1) {
                self.saveToIpfs(archiveFile)
            } else {
                console.log("IPFS backup disabled in .env")
            }
        })
    }

    async saveToIpfs(archiveFile) {

        let self = this;
        const version = await this.ipfsNode.version()

        const now = new Date();
        const timestamp = Math.round(now.getTime() / 1000);

        let ipfsPath = '/backup/pac_backup.tar.gz';

        if (fs.existsSync(archiveFile)) {
            console.log('Version:', version.version)

            for await (let fileAdded of this.ipfsNode.add({
                path: ipfsPath,
                content: fs.readFileSync(archiveFile),
                mtime: now,
            })) {
                if(fileAdded.path === 'backup') {
                    self.updateDb(fileAdded, timestamp)
                }
            }
        }
    }

    async updateDb(fileInfo, timestamp) {
        console.log(fileInfo.path, fileInfo.cid.toString(), 'https://ipfs.io/ipfs/' + fileInfo.cid.toString());

        let ipfsDoc = {
            type: 'db_backup',
            filename: 'pac_backup.tar.gz',
            cid: fileInfo.cid.toString(),
            uri: fileInfo.cid.toString() + '/pac_backup.tar.gz',
            timestamp: timestamp
        }

        await this.collection.insertOne(ipfsDoc);

        // todo - possibly secure the IPFS CID hash by submitting as a BEACON hash to Mainchain
    }
}

module.exports = BackupDaemon;
