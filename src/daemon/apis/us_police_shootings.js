const CSVParse = require('csv-parse/lib/sync');
const UsStates = require('us-state-codes');

const IncidentReport = require('../../common/incident_report.js');
const {fetchData, sleepFor} = require('../../common/utils');
const ReportApi = require('./api');

const SOURCE_NAME = "USPoliceShootings";

const BASE_DATA_URL = "https://docs.google.com/spreadsheets/d/1cEGQ3eAFKpFBVq1k2mZIy5mBPxC6nBTJHzuSWtZQSVw";

class USPoliceShootings extends ReportApi {
    constructor(_dbOptions, _limit = -1) {
        super(_dbOptions, _limit);
    }

    async run() {
        let self = this;
        console.log("start", SOURCE_NAME);
        console.log("limit", this.limit);

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
                if(d.State.length === 0 || d.State === '' || d['Victim Name'].length === 0 || d['Victim Name'] === '') {
                    console.log("no data. skipping");
                    continue;
                }
                if(this.limit > 0 && this.limit === i) {
                    processCompleteCallback(true);
                    return;
                }

                // no native ID, so need to create one.
                let dateAdded = new Date(d.Timestamp);
                let dateOfIncident = d['Date of Incident'];
                if(dateOfIncident.length === 0) {
                    dateOfIncident = d['Date Searched'];
                }
                let incidentDate = new Date(dateOfIncident);

                const indidentMonth = incidentDate.toLocaleString('default', { month: 'long' });
                let timestampAdded = Math.round(dateAdded / 1000);
                let stateCode = UsStates.sanitizeStateCode(d.State.substring(0, 2));

                let sourceId = stateCode + "-" + timestampAdded + "-" + d['Victim Name'].replace(/[\W_]+/g, "-");

                console.log(SOURCE_NAME, ": process", i, "/", numRecords, "uspsh-id:", sourceId);

                let report = await this.collection.find({
                    $and: [{source: SOURCE_NAME}, {sourceId: sourceId}],
                }).limit(1).toArray();

                if(report.length > 0) {
                    console.log(SOURCE_NAME, sourceId, "already recorded. Update potential cross references for", report[0]._id);
                    try {
                        let crRes = await this.updateCrossReferences(report[0]._id);
                        console.log("has cross references:", crRes)
                    } catch(crErr) {
                        console.log("cross reference update error:", crErr)
                    }
                } else {
                    let ir = new IncidentReport();
                    let incidentDateFormatted = incidentDate.getDate() + ' ' + indidentMonth + ' ' + incidentDate.getFullYear();
                    let timestampIncident = Math.round(incidentDate / 1000);
                    let stateName = UsStates.getStateNameByStateCode(stateCode);

                    let title = d['Victim Name'] + ( (parseInt(d["Victim's Age"]) > 0) ?  ', ' + d["Victim's Age"] : '' ) + ', from ' + d.City + ', ' + stateName
                        + ', on ' + incidentDateFormatted;
                    ir.setTitle(title);

                    ir.setContent(d.Summary);

                    ir.setVictimName(d['Victim Name']);

                    ir.setSource(
                        SOURCE_NAME,
                        sourceId,
                        BASE_DATA_URL,
                        timestampIncident,
                        JSON.stringify(d),
                        'json'
                    );

                    ir.setLocation(
                        "US",
                        stateCode,
                        d.City
                    );

                    if(d['Source Link'].length > 0) {
                        ir.addEvidenceLink(d['Source Link']);
                    }

                    ir.setVictimRace(d.Race);
                    ir.setVictimAge(d["Victim's Age"]);
                    ir.setVictimGender(d["Victim's Gender"]);
                    ir.setVictimArmed(d['Armed or Unarmed?']);

                    let additionalEvidence = {
                        timestamp: d.Timestamp,
                        date_searched: d['Date Searched'],
                        state: d.State,
                        county: d.County,
                        city: d.City,
                        agency_name: d['Agency Name'],
                        victim_name: d['Victim Name'],
                        victim_age: d["Victim's Age"],
                        victim_gender: d["Victim's Gender"],
                        race: d.Race,
                        hispanic_or_latino: d['Hispanic or Latino Origin'],
                        shots_fired: d['Shots Fired'],
                        hit_or_killed: d['Hit or Killed?'],
                        armed_or_unarmed: d['Armed or Unarmed?'],
                        weapon: d.Weapon,
                        name_of_officer_or_officers: d['Name of Officer or Officers'],
                        shootings: d.Shootings,
                        was_shooting_justified: d['Was the Shooting Justified?'],
                        date_of_indcident: d['Date of Incident']
                    };

                    let evidence = {
                        type: "text",
                        data: additionalEvidence
                    };

                    ir.setEvidenceAdditional(evidence);

                    try {
                        let dbInsRes = await this.addReportToBb(ir);
                        console.log("uspsh-id:", sourceId, "inserted into db:", dbInsRes);
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

module.exports = USPoliceShootings;
