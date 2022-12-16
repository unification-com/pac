const CSVParse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify')
const UsStates = require('us-state-codes');

const IncidentReport = require('../../common/incident_report.js');
const {fetchData, sleepFor} = require('../../common/utils');
const ReportApi = require('./api');

const SOURCE_NAME = "WashingtonPost";

const BASE_DATA_URL = "https://raw.githubusercontent.com/washingtonpost/data-police-shootings/master/v2/fatal-police-shootings-data.csv";

class WashingtonPost extends ReportApi {
    constructor(_mongoClient, _limit = -1) {
        super(_mongoClient, _limit);
    }

    async run() {
        let self = this;
        console.log("start", SOURCE_NAME);
        return new Promise((resolve) => {
            Promise.all([fetchData(BASE_DATA_URL)]).then((values) => {
                self.baseData = values[0];
                self.processData(function(status) {
                    resolve(status);
                });
            }).catch(console.error);
        });
    }

    async processData(processCompleteCallback) {
        if (this.baseData !== null) {
            const records = CSVParse(this.baseData, {
                columns: true,
                skip_empty_lines: true
            });

            let i = 0;
            let numRecords = records.length;
            for (let d of records) {
                i++;
                if(this.limit > 0 && this.limit === i) {
                    processCompleteCallback(true);
                    return;
                }
                // first search the collection to see if it's already been recorded
                console.log(SOURCE_NAME, ": process", i, "/", numRecords, "wp-id:", d.id);

                let report = await this.collection.find({
                    $and: [{source: SOURCE_NAME}, {sourceId: d.id}],
                }).limit(1).toArray();

                if(report.length > 0) {
                    console.log(SOURCE_NAME, d.id, "already recorded. Update potential cross references for", report[0]._id);
                    try {
                        let crRes = await this.updateCrossReferences(report[0]._id);
                        console.log("has cross references:", crRes)
                    } catch(crErr) {
                        console.log("cross reference update error:", crErr)
                    }
                } else {
                    // it's new data, so create a standardised IncidentReport object and
                    // send it back via the callback function for DB insertion etc.
                    let ir = new IncidentReport();

                    let date = new Date(d.date);
                    const month = date.toLocaleString('default', { month: 'long' });
                    let dateFormatted = date.getDate() + ' ' + month + ' ' + date.getFullYear();
                    let timestamp = Math.round(date / 1000);

                    let stateCode = UsStates.sanitizeStateCode(d.state);
                    let stateName = UsStates.getStateNameByStateCode(stateCode);

                    // first fill out the basic data from the original data source
                    let title = d.name + ( (parseInt(d.age) > 0) ?  ', ' + d.age : '' ) + ', from ' + d.city + ', ' + stateName
                        + ' - ' + d.manner_of_death + ' on ' + dateFormatted;
                    ir.setTitle(title);

                    ir.setSource(
                        SOURCE_NAME,
                        d.id,
                        BASE_DATA_URL,
                        timestamp,
                        JSON.stringify(d),
                        'json'
                    );

                    ir.setContent("");

                    ir.setVictimName(d.name);

                    ir.setLocation(
                        "US",
                        d.state,
                        d.city
                    );

                    ir.setVictimRace(d.race);
                    ir.setVictimAge(d.age);
                    ir.setVictimGender(d.gender);
                    ir.setVictimArmed(d.armed_with);

                    if(d.longitude && d.latitude) {
                        ir.setGeoLocation(d.latitude, d.longitude);
                    }

                    let additionalEvidence = {
                        name: d.name,
                        date: d.date,
                        manner_of_death: "Police Shooting", // see https://github.com/washingtonpost/data-police-shootings/tree/master/v2
                        armed_with: d.armed_with,
                        age: d.age,
                        gender: d.gender,
                        race: d.race,
                        race_source: d.race_source,
                        city: d.city,
                        state: d.state,
                        was_mental_illness_related: d.was_mental_illness_related,
                        threat_type: d.threat_type,
                        flee_status: d.flee_status,
                        body_camera: d.body_camera,
                        location_precision: d.location_precision,
                        agency_ids: d.agency_ids,
                    }

                    let evidence = {
                        type: "text",
                        data: additionalEvidence
                    };

                    ir.setEvidenceAdditional(evidence);

                    try {
                        let dbInsRes = await this.addReportToDb(ir);
                        console.log("wp-id:", d.id, "inserted into db:", dbInsRes);
                    } catch(dbErr) {
                        console.log("db inster err:", dbErr);
                    }
                    await sleepFor(50);
                }
            }
            console.log(SOURCE_NAME, "update complete")
            processCompleteCallback(true);
        }
    }
}

module.exports = WashingtonPost;
