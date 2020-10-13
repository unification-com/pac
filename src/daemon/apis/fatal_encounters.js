const CSVParse = require('csv-parse/lib/sync');
const UsStates = require('us-state-codes');

const IncidentReport = require('../../common/incident_report.js');
const {fetchData, sleepFor} = require('../../common/utils');
const ReportApi = require('./api');

const SOURCE_NAME = "FatalEncountersDotOrg";

const BASE_DATA_URL = "https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE";

class FatalEncountersDotOrg extends ReportApi {
    constructor(_mongoClient, _limit = -1) {
        super(_mongoClient, _limit);
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
                if(d['Unique ID'] < 1 || d['State'].length === 0 || d['State'] === '' || d["Name"].length === 0 || d["Name"] === '') {
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

                    let stateCode = UsStates.sanitizeStateCode(d['State']);
                    let stateName = UsStates.getStateNameByStateCode(stateCode);

                    let title = d["Name"] + ( (parseInt(d["Age"]) > 0) ?  ', ' + d["Age"] : '' )
                        + ', from ' + d['Location of death (city)'] + ', ' + stateName
                        + ', on ' + dateFormatted;
                    ir.setTitle(title);

                    ir.setContent(d['Brief description']);

                    ir.setVictimName(d["Name"]);

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

                    ir.addEvidenceLink(d['Supporting document link']);

                    if(d['URL of image (PLS NO HOTLINKS)'].length > 0) {
                        ir.addEvidenceLink(d['URL of image (PLS NO HOTLINKS)'])
                    }

                    ir.setVictimRace(d["Race"]);
                    ir.setVictimAge(d["Age"]);
                    ir.setVictimGender(d["Gender"]);
                    ir.setVictimArmed('');

                    let additionalEvidence = {
                        name: d["Name"],
                        age: d["Age"],
                        gender: d["Gender"],
                        race: d["Race"],
                        race_with_imputations: d["Race with imputations"],
                        imputation_probability: d['Imputation probability'],
                        address: d['Location of injury (address)'],
                        city: d['Location of death (city)'],
                        state: d['State'],
                        zipcode: d['Location of death (zip code)'],
                        county: d['Location of death (county)'],
                        full_address: d['Full Address'],
                        agency_responsible: d['Agency or agencies involved'],
                        cause_of_death: d['Cause of death'],
                        dispositions_exclusions: d['Dispositions/Exclusions INTERNAL USE, NOT FOR ANALYSIS'],
                        image_of_victim: d['URL of image (PLS NO HOTLINKS)']
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