require('dotenv').config();
const mongo = require('mongodb');
const UndClient = require('@unification-com/und-js');

const { sleepFor } = require('../common/utils')

const PAC_CONFIG = require('../common/constants');

class BeaconDaemon {
    constructor(_mongoClient) {
        this.mongoClient = _mongoClient;
        this.BEACON_UPDATE_RUNNING = false;
        this.undClient = null;
    }

    async getUndClient() {
        const undClient = new UndClient(process.env.MAINCHAIN_REST)
        await undClient.initChain()
        undClient.setBroadcastMode("block")
        await undClient.setPrivateKey(process.env.BEACON_OWNER_PK)
        // use default delegates (signing, broadcast)
        undClient.useDefaultSigningDelegate()
        undClient.useDefaultBroadcastDelegate()
        this.undClient = undClient
    }

    async submitBeaconHashes() {
        if (process.env.BEACON_OWNER_ADDRESS === '' || process.env.BEACON_ID === '' || process.env.BEACON_OWNER_PK === '') {
            console.log("BEACON vars not set. Skip hash submission");
            this.BEACON_UPDATE_RUNNING = false;
            return;
        }

        if (this.BEACON_UPDATE_RUNNING) {
            console.log("BEACON update already in progress");
            return;
        }
        this.BEACON_UPDATE_RUNNING = true;

        const db = this.mongoClient.db(process.env.MONGODB_DBNAME);
        const collection = db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION);

        console.log("timestamps to submit");

        let batchLimit = parseInt((process.env.BEACON_SUBMIT_IN_BATCH || PAC_CONFIG.DEFAULT_BEACON_SUBMIT_IN_BATCH));

        let beaconsToSubmit = await collection.find({
            beaconTimestampId: 0,
        }).limit(batchLimit).toArray();

        await this.getUndClient();

        for (let b of beaconsToSubmit) {
            console.log("record BEACON hash", b.beaconHash);
            const now = new Date();
            const timestamp = Math.round(now.getTime() / 1000);
            try {
                let subRes = await this.undClient.recordBeaconTimestamp(
                    process.env.BEACON_ID,
                    b.beaconHash,
                    timestamp
                );

                if ('data' in subRes.result && 'height' in subRes.result) {
                    let txHash = subRes.result.txhash;
                    let mcHeight = subRes.result.height;
                    let tsId = subRes.result.data;
                    let tsIdInt = parseInt(tsId, 16);

                    if (tsIdInt > 0) {
                        console.log("BEACON SUBMIT SUCCESS");
                        console.log("txHash", txHash, "height", mcHeight, "tsId", tsId, "parseInt(tsId)", tsIdInt);

                        console.log("update database _id:", b._id);
                        // ToDo - handle update error
                        var dbRes = await collection.updateOne(
                            {_id: new mongo.ObjectID(b._id)},
                            {
                                $set: {
                                    beaconTimestamp: timestamp,
                                    beaconTimestampId: tsIdInt,
                                    mainchainTxHash: txHash,
                                    mainchainBlockHeight: mcHeight,
                                    addedToMerkleTree: false,
                                }
                            });
                    }
                }
            } catch (err) {
                console.log("FAILED TO SUBMIT BEACON HASH");
                this.BEACON_UPDATE_RUNNING = false;
                console.log(err)
            }
            console.log("wait a second...")
            await sleepFor(1000);
        }
        console.log("BEACON batch done. Run Merkle tree.")
        this.BEACON_UPDATE_RUNNING = false;
        //await generateMerkleTree();
    }
}

module.exports = BeaconDaemon;
