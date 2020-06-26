const CSVParse = require('csv-parse/lib/sync');
const UsStates = require('us-state-codes');
const fs = require('fs');

const IncidentReport = require('../../common/incident_report.js');
const {sleepFor} = require('../../common/utils');
const ReportApi = require('./api');

const SOURCE_NAME = "GuardianTheCounted";

const BASE_DATA_URL = "https://www.theguardian.com/us-news/ng-interactive/2015/jun/01/about-the-counted";

class GuardianTheCounted extends ReportApi {
    constructor(_dbOptions, _limit = -1) {
        super(_dbOptions, _limit);
    }

    async run() {
        let self = this;
        console.log("start", SOURCE_NAME);
        return new Promise((resolve) => {
            Promise.all([this.loadData('./data/static/the-counted-2015.csv'), this.loadData('./data/static/the-counted-2016.csv')]).then((values) => {
                self.baseData = values[0].concat(values[1]);
                self.processData(function(status) {
                    resolve(status);
                });
            }).catch(console.error);
        });
    }

    loadData(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', function(err, content){
                const records = CSVParse(content, {
                    columns: true,
                    skip_empty_lines: true
                });
                if(err) {
                    reject(err);
                } else {
                    resolve(records);
                }
            });
        });
    }

    async processData(processCompleteCallback) {
        if (this.baseData !== null) {
            let i = 0;
            let numRecords = this.baseData.length;
            for (let d of this.baseData) {
                i++;
                if(this.limit > 0 && this.limit === i) {
                    processCompleteCallback(true);
                    return;
                }
                console.log(SOURCE_NAME, ": process", i, "/", numRecords, "gtc-id:", d.uid);
                let report = await this.collection.find({
                    $and: [{source: SOURCE_NAME}, {sourceId: d.uid}],
                }).limit(1).toArray();
                if(report.length > 0) {
                    console.log(SOURCE_NAME, d.uid, "already recorded. Update potential cross references for", report[0]._id);
                    try {
                        let crRes = await this.updateCrossReferences(report[0]._id);
                        console.log("has cross references:", crRes)
                    } catch(crErr) {
                        console.log("cross reference update error:", crErr)
                    }
                } else {
                    let ir = new IncidentReport();

                    let date = new Date(d.day + " " + d.month + " " + d.year);
                    const month = date.toLocaleString('default', { month: 'long' });
                    let dateFormatted = date.getDate() + ' ' + month + ' ' + date.getFullYear();
                    let timestamp = Math.round(date / 1000);

                    let stateCode = UsStates.sanitizeStateCode(d.state);
                    let stateName = UsStates.getStateNameByStateCode(stateCode);

                    let title = d.name + ( (parseInt(d.age) > 0) ?  ', ' + d.age : '' ) + ', from ' + d.city + ', ' + stateName
                        + ', on ' + dateFormatted;
                    ir.setTitle(title);
                    ir.setContent("");
                    ir.setVictimName(d.name);

                    ir.setSource(
                        SOURCE_NAME,
                        d.uid,
                        BASE_DATA_URL,
                        timestamp,
                        JSON.stringify(d),
                        'json'
                    );
                    ir.setLocation(
                        "US",
                        stateCode,
                        d.city
                    );

                    ir.setVictimRace(d.raceethnicity);
                    ir.setVictimAge(d.age);
                    ir.setVictimGender(d.gender);
                    ir.setVictimArmed(d.armed);

                    let additionalEvidence = {
                        name: d.name,
                        age: d.age,
                        gender: d.gender,
                        race_ethnicity: d.raceethnicity,
                        day: d.day,
                        month: d.month,
                        year: d.year,
                        street_address: d.streetaddress,
                        city: d.city,
                        state: d.state,
                        classification: d.classification,
                        law_enforcement_agency: d.lawenforcementagency,
                        armed: d.armed
                    };

                    let evidence = {
                        type: "text",
                        data: additionalEvidence
                    };

                    ir.setEvidenceAdditional(evidence);

                    try {
                        let dbInsRes = await this.addReportToDb(ir);
                        console.log("gtc-id:", d.uid, "inserted into db:", dbInsRes);
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

module.exports = GuardianTheCounted;
