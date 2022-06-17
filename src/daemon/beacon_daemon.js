require('dotenv').config();
const mongo = require('mongodb');

const { sleepFor } = require('../common/utils')

const PAC_CONFIG = require('../common/constants');

class BeaconDaemon {
    constructor(_mongoClient) {
        this.mongoClient = _mongoClient;
        this.undClient = null;
    }

    async getUndClient() {
        const UndClient = await import("@unification-com/und-js-v2")
        const undClient = new UndClient.default.UndClient(process.env.MAINCHAIN_REST, 'BROADCAST_MODE_BLOCK')
        await undClient.initChain()
        await undClient.setPrivateKey(process.env.BEACON_OWNER_PK)
        this.undClient = undClient
    }

    async submitBeaconHashes() {
        if (process.env.BEACON_OWNER_ADDRESS === '' || process.env.BEACON_ID === '' || process.env.BEACON_OWNER_PK === '') {
            console.log("BEACON vars not set. Skip hash submission");
            process.exit()
        }

        const db = this.mongoClient.db(process.env.MONGODB_DBNAME);
        const collection = db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION);

        console.log("timestamps to submit");

        let batchLimit = parseInt((process.env.BEACON_SUBMIT_IN_BATCH || PAC_CONFIG.DEFAULT_BEACON_SUBMIT_IN_BATCH));

        let beaconsToSubmit = await collection.find({
            beaconTimestampId: 0,
        }).sort({ sourceDatetime: -1 }).limit(batchLimit).toArray();

        await this.getUndClient();

        for (let b of beaconsToSubmit) {
            console.log("record BEACON hash", b.beaconHash);
            const now = new Date();
            const timestamp = Math.round(now.getTime() / 1000);
            try {
                let subRes = await this.undClient.recordBeaconTimestamp(
                    process.env.BEACON_ID,
                    b.beaconHash,
                    timestamp,
                    process.env.BEACON_OWNER_ADDRESS,
                    250000
                );

                if ('txhash' in subRes.tx_response && 'height' in subRes.tx_response && 'code' in subRes.tx_response) {

                    if(parseInt(subRes.tx_response.code, 10) !== 0) {
                        console.log("FAILED TO SUBMIT BEACON HASH");
                        console.log("tx response");
                        console.log(subRes);
                        continue;
                    }

                    let txHash = subRes.tx_response.txhash;
                    let mcHeight = subRes.tx_response.height;
                    let tsId = 0
                    for(let i = 0; i < subRes.tx_response.events.length; i += 1) {
                        const event = subRes.tx_response.events[i]
                        if(event.type === "record_beacon_timestamp") {
                            for(let j = 0; j < event.attributes.length; j += 1) {
                                const attribute = event.attributes[j]
                                const key = Buffer.from(attribute.key, 'base64').toString()
                                const value = Buffer.from(attribute.value, 'base64').toString()
                                if(key === 'beacon_timestamp_id') {
                                    tsId = value
                                }
                            }
                        }
                    }

                    if (tsId > 0) {
                        console.log("BEACON SUBMIT SUCCESS");
                        console.log("txHash", txHash, "height", mcHeight, "tsId", tsId);

                        console.log("update database _id:", b._id);
                        // ToDo - handle update error
                        var dbRes = await collection.updateOne(
                            {_id: new mongo.ObjectID(b._id)},
                            {
                                $set: {
                                    beaconTimestamp: timestamp,
                                    beaconTimestampId: tsId,
                                    mainchainTxHash: txHash,
                                    mainchainBlockHeight: mcHeight,
                                    addedToMerkleTree: false,
                                }
                            });
                    }
                }
            } catch (err) {
                console.log("FAILED TO SUBMIT BEACON HASH");
                console.log(err)
            }
            console.log("wait 1 seconds...")
            await sleepFor(1000);
        }
        console.log("BEACON batch done.")
        process.exit()
    }
}

module.exports = BeaconDaemon;
