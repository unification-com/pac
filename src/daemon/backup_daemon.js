require('dotenv').config();
const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client')
const AdmZip = require('adm-zip');

const {dbBackUp} = require('../db_utils/backup');

const PAC_CONFIG = require('../common/constants');

class BackupDaemon {
    constructor(_mongoClient) {
        this.mongoClient = _mongoClient;
        const db = this.mongoClient.db(process.env.MONGODB_DBNAME);
        this.collection = db.collection(PAC_CONFIG.IPFS_HISTORY_COLLECTION);
        this.ipfsClient = null;
        this.backupToIPFS = (parseInt(process.env.BACKUP_TO_IPFS) || 0);
        this.backupFileName = 'pac_db.zip';
    }

    async backupDb(ipfsUrl = "http://127.0.0.1:5002") {
        console.log("run DB backup");
        if(this.backupToIPFS === 1 && this.ipfsClient === null) {
            this.ipfsClient = await IpfsHttpClient(ipfsUrl);
            const { id, agentVersion } = await this.ipfsClient.id()
            console.log(`IPFS Version ${agentVersion}`)
            console.log(`IPFS Peer ID ${id}`)
        }

        try {
            const backupDir = await dbBackUp( './data/backup/pac_mongodb_backup' )

            if ( !fs.existsSync( backupDir ) ) {
                console.log( "something went wrong" )
                process.exit( 1 )
            }

            console.log( "BACKUP SUCCESS. Location:", backupDir );
            const archiveFile = await this.compressBackup( backupDir );

            if(this.backupToIPFS === 1) {
                const fileAdded = await this.saveToIpfs(archiveFile)
                console.log(fileAdded)
            } else {
                console.log("IPFS backup disabled in .env")
            }
        } catch (err) {
            console.error("backup error", err)
            process.exit( 1 )
        }
        process.exit( 0 )
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
        return new Promise((resolve, reject) => {
            let self = this;
            let archiveFile = './data/backup/' + this.backupFileName;
            let zip = new AdmZip();
            zip.addLocalFolder(backupDir);
            zip.writeZip(archiveFile, function(ok) {
                console.log("writeZip res",ok);
                console.log("zipfile created in ", archiveFile, ". Remove dir", backupDir)
                self.removeDir(backupDir)
                resolve(archiveFile)
            });
        })
    }

    async saveToIpfs(archiveFile) {
        const version = await this.ipfsClient.version()
        console.log('Version:', version.version)

        const now = new Date();
        const timestamp = Math.round(now.getTime() / 1000);

        let ipfsPath = '/backup/' + this.backupFileName;

        return new Promise(async (resolve, reject) => {
            if (fs.existsSync(archiveFile)) {
                const fileAdded = await this.ipfsClient.add({
                    path: ipfsPath,
                    content: fs.readFileSync(archiveFile),
                })

                if(fileAdded.path === 'backup') {
                    await this.updateDb(fileAdded, timestamp)
                }

            resolve(fileAdded)
            }
        })
    }

    async updateDb(fileInfo, timestamp) {
        console.log(JSON.stringify(fileInfo));
        console.log(fileInfo.path, fileInfo.cid.toString(), 'https://ipfs.io/ipfs/' + fileInfo.cid.toString());

        let ipfsDoc = {
            cid: fileInfo.cid.toString(),
            filename: this.backupFileName,
            timestamp: timestamp,
            type: 'db_backup'
        }

        await this.collection.insertOne(ipfsDoc);

        // todo - possibly secure the IPFS CID hash by submitting as a BEACON hash to Mainchain
    }
}

module.exports = BackupDaemon;
