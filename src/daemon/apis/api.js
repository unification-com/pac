require('dotenv').config();
const mongo = require('mongodb');

class ReportApi {
    constructor(_dbOptions, _limit = -1) {
        this.dbOptions = _dbOptions;
        const db = this.dbOptions.client.db(this.dbOptions.dbName);
        this.collection = db.collection(this.dbOptions.collectionName);
        this.baseData = null;
        this.limit = _limit; // used in testing to grab a few records from each source
    }

    async addReportToDb (ir) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = this.dbOptions.client.db(process.env.MONGODB_DBNAME);
                const collection = db.collection('incident_reports');

                if (ir.victimName !== '' && ir.victimName.length > 0) {
                    // before inserting, check for cross references - might be included from another source
                    console.log("check potential cross references before inserting, with params:", ir.victimName, ir.sourceDatetime, ir.locationStateCode);
                    let crossReferences = await collection.find({
                        $and: [{victimName: ir.victimName}, {sourceDatetime: ir.sourceDatetime}, {locationStateCode: ir.locationStateCode}],
                    }).toArray();

                    if (crossReferences.length > 0) {
                        console.log("found", crossReferences.length, "cross references")
                        console.log("this report", ir.source, ir.sourceId, ir.beaconHash);
                        for (let cr of crossReferences) {
                            if (cr.source !== ir.source) {
                                console.log("add cross reference", cr.source, cr.sourceId, cr._id, cr.beaconHash);
                                ir.addCrossReference(cr.source, cr.sourceId, cr._id, cr.beaconHash);
                            }
                        }
                    }
                }

                ir.setDbInsertDatetime();
                ir.setBeacon(0, 0, '', 0);

                // already checked in PB, but double check by beacon hash.
                let checkExists = collection.find({
                    beaconHash: ir.beaconHash,
                }).limit(1).toArray();

                if (checkExists.length > 0) {
                    console.log("REPORT EXISTS");
                    resolve(false);
                } else {
                    console.log("REPORT DOESN'T EXIST - INSERT TO DB");
                    // ToDo - handle insert error
                    let res = await collection.insertOne(ir.getFullDbObject());
                    resolve(true);
                }
            } catch (err) {
                console.log(err.stack);
                reject(err.stack);
            }
        });
    }

    async updateCrossReferences(_id) {
        return new Promise(async (resolve) => {
            try {
                const db = this.dbOptions.client.db(process.env.MONGODB_DBNAME);
                const collection = db.collection('incident_reports');

                let report = await collection.find({
                    _id: new mongo.ObjectID(_id),
                }).limit(1).toArray();

                if (report === null || report === undefined || report.length === 0) {
                    console.log("updateCrossReferences", _id, "not found");
                    resolve(false);
                }

                let thisReport = report[0];

                if (thisReport.victimName === '' || thisReport.victimName.length === 0) {
                    resolve(false);
                }

                let reportCrs = thisReport.crossReferences;
                let initialSize = reportCrs.length;
                console.log("search potential cross references with params:", thisReport.victimName, thisReport.sourceDatetime, thisReport.locationStateCode);

                let crossReferences = await collection.find({
                    $and: [{victimName: thisReport.victimName}, {sourceDatetime: thisReport.sourceDatetime}, {locationStateCode: thisReport.locationStateCode}],
                }).toArray();

                if (crossReferences.length > 0) {
                    for (let newCr of crossReferences) {
                        let exists = false;
                        if (newCr._id === _id) {
                            // it's the report we're updating - ignore.
                            continue;
                        }
                        if (newCr.source === thisReport.source) {
                            // same source - ignore
                            continue;
                        }
                        for (let repCr of reportCrs) {
                            if (repCr.collectionId === newCr._id || repCr.beaconHash === newCr.beaconHash) {
                                // already added. ignore
                                exists = true;
                            }
                        }
                        if (exists) {
                            continue;
                        }
                        let cr = {
                            source: newCr.source,
                            sourceId: newCr.sourceId,
                            collectionId: newCr._id,
                            beaconHash: newCr.beaconHash
                        }
                        reportCrs.push(cr);
                    }
                    // update
                    if (reportCrs.length > initialSize) {
                        // ToDo - handle update error
                        var results = await collection.updateOne(
                            {_id: new mongo.ObjectID(_id)},
                            {$set: {crossReferences: reportCrs, hasCrossReferences: true}}, {
                                upsert: true
                            });
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            } catch (err) {
                console.log(err.stack);
                reject(err.stack);
            }
        });
    }
}

module.exports = ReportApi;
