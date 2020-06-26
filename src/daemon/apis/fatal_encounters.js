const CSVParse = require('csv-parse/lib/sync');
const UsStates = require('us-state-codes');

const IncidentReport = require('../../common/incident_report.js');
const {fetchData, sleepFor} = require('../../common/utils');
const ReportApi = require('./api');

const SOURCE_NAME = "FatalEncountersDotOrg";

const BASE_DATA_URL = "https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE";

class FatalEncountersDotOrg extends ReportApi {
    constructor(_dbOptions, _limit = -1) {
        super(_dbOptions, _limit);
    }

    async run() {
        let self = this;
        console.log("start", SOURCE_NAME);
        return new Promise((resolve) => {
            Promise.all([fetchData(BASE_DATA_URL + '/export?exportFormat=csv')]).then((values) => {
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
                // first search the collection to see if it's already been recorded
                if(d['Unique ID'] < 1 || d['Location of death (state)'].length === 0 || d['Location of death (state)'] === '' || d["Subject's name"].length === 0 || d["Subject's name"] === '') {
                    console.log("no data. skipping");
                    continue;
                }

                if(this.limit > 0 && this.limit === i) {
                    processCompleteCallback(true);
                    return;
                }

                console.log(SOURCE_NAME, ": process", i, "/", numRecords, "fe-id:", d['Unique ID']);

                let report = await this.collection.find({
                    $and: [{source: SOURCE_NAME}, {sourceId: d['Unique ID']}],
                }).limit(1).toArray();

                if(report.length > 0) {
                    console.log(SOURCE_NAME, d['Unique ID'], "already recorded. Update potential cross references for", report[0]._id);
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

                    let date = new Date(d['Date of injury resulting in death (month/day/year)']);
                    const month = date.toLocaleString('default', { month: 'long' });
                    let dateFormatted = date.getDate() + ' ' + month + ' ' + date.getFullYear();
                    let timestamp = Math.round(date / 1000);

                    let stateCode = UsStates.sanitizeStateCode(d['Location of death (state)']);
                    let stateName = UsStates.getStateNameByStateCode(stateCode);

                    let title = d["Subject's name"] + ( (parseInt(d["Subject's age"]) > 0) ?  ', ' + d["Subject's age"] : '' )
                        + ', from ' + d['Location of death (city)'] + ', ' + stateName
                        + ', on ' + dateFormatted;
                    ir.setTitle(title);

                    ir.setContent(d['Date&Description']);

                    ir.setVictimName(d["Subject's name"]);

                    ir.setSource(
                        SOURCE_NAME,
                        d['Unique ID'],
                        BASE_DATA_URL,
                        timestamp,
                        JSON.stringify(d),
                        'json'
                    );

                    ir.setLocation(
                        "US",
                        stateCode,
                        d['Location of death (city)'],
                        d.Latitude,
                        d.Longitude
                    );

                    ir.addEvidenceLink(d['Link to news article or photo of official document']);
                    if(d.Video.length > 0) {
                        ir.addEvidenceLink(d.Video);
                    }
                    if(d['URL of image of deceased'].length > 0) {
                        ir.addEvidenceLink(d['URL of image of deceased'])
                    }

                    ir.setVictimRace(d["Subject's race"]);
                    ir.setVictimAge(d["Subject's age"]);
                    ir.setVictimGender(d["Subject's gender"]);
                    ir.setVictimArmed('');

                    let additionalEvidence = {
                        name: d["Subject's name"],
                        age: d["Subject's age"],
                        gender: d["Subject's gender"],
                        race: d["Subject's race"],
                        race_with_imputations: d["Subject's race with imputations"],
                        imputation_probability: d['Imputation probability'],
                        address: d['Location of injury (address)'],
                        city: d['Location of death (city)'],
                        state: d['Location of death (state)'],
                        zipcode: d['Location of death (zip code)'],
                        county: d['Location of death (county)'],
                        full_address: d['Full Address'],
                        agency_responsible: d['Agency responsible for death'],
                        cause_of_death: d['Cause of death'],
                        dispositions_exclusions: d['Dispositions/Exclusions INTERNAL USE, NOT FOR ANALYSIS'],
                        mental_illness: d['Symptoms of mental illness? INTERNAL USE, NOT FOR ANALYSIS'],
                        year: d['Date (Year)'],
                        image_of_victim: d['URL of image of deceased']
                    };

                    let evidence = {
                        type: "text",
                        data: additionalEvidence
                    };

                    ir.setEvidenceAdditional(evidence);

                    try {
                        let dbInsRes = await this.addReportToDb(ir);
                        console.log("fe-id:", d['Unique ID'], "inserted into db:", dbInsRes);
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

module.exports = FatalEncountersDotOrg;