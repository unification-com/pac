const UsStates = require('us-state-codes');
const CSVParse = require('csv-parse/lib/sync');
const fs = require('fs');
const XLSX = require('xlsx');
const IncidentReport = require('../../common/incident_report.js');
const {downloadFile, sleepFor} = require('../../common/utils');
const ReportApi = require('./api');

const SOURCE_NAME = "MappingPoliceViolence";

const BASE_DATA_URL = "https://mappingpoliceviolence.org";

class MappingPoliceViolence extends ReportApi {
    constructor(_dbOptions, _limit = -1) {
        super(_dbOptions, _limit);
        this.baseDataPath = './data/mapping_police_violence.xlsx';
    }

    async run() {
        let self = this;
        console.log("start", SOURCE_NAME);
        return new Promise((resolve) => {
            Promise.all([downloadFile(BASE_DATA_URL + '/s/MPVDatasetDownload.xlsx', this.baseDataPath)]).then((values) => {
                if (values[0] === true) {
                    console.log("file downloaded OK");
                    let buf = fs.readFileSync(this.baseDataPath);
                    let wb = XLSX.read(buf, {type: 'buffer'});
                    let data = XLSX.utils.sheet_to_csv(wb.Sheets['2013-2019 Police Killings']);
                    this.baseData = CSVParse(data, {
                        columns: true,
                        skip_empty_lines: true
                    });
                    self.processData(function(status) {
                        resolve(status);
                    });
                }
            }).catch(console.error);
        });
    }

    async processData(processCompleteCallback) {
        if(this.baseData !== null) {
            let i = 0;
            let numRecords = this.baseData.length;
            for (let d of this.baseData) {
                i++;
                // first search the collection to see if it's already been recorded
                if(d.ID < 1 || d.State.length === 0 || d.State === '' || d["Victim's name"].length === 0 || d["Victim's name"] === '') {
                    console.log("no data. skipping");
                    continue;
                }
                if(this.limit > 0 && this.limit === i) {
                    processCompleteCallback(true);
                    return;
                }
                console.log(SOURCE_NAME, ": process", i, "/", numRecords, "mpv-id:", d.ID);

                let report = await this.collection.find({
                    $and: [{source: SOURCE_NAME}, {sourceId: d.ID}],
                }).limit(1).toArray();
                if(report.length > 0) {
                    console.log(SOURCE_NAME, d.ID, "already recorded. Update potential cross references for", report[0]._id);
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

                    let date = new Date(d['Date of Incident (month/day/year)']);
                    const month = date.toLocaleString('default', { month: 'long' });
                    let dateFormatted = date.getDate() + ' ' + month + ' ' + date.getFullYear();
                    let timestamp = Math.round(date / 1000);

                    let stateCode = UsStates.sanitizeStateCode(d.State);
                    let stateName = UsStates.getStateNameByStateCode(stateCode);

                    let title = d["Victim's name"] + ( (parseInt(d["Victim's age"]) > 0) ?  ', ' + d["Victim's age"] : '' ) + ', from ' + d.City + ', ' + stateName
                        + ', on ' + dateFormatted;
                    ir.setTitle(title);

                    ir.setContent(d['A brief description of the circumstances surrounding the death']);

                    ir.setVictimName(d["Victim's name"]);

                    ir.setSource(
                        SOURCE_NAME,
                        d.ID,
                        BASE_DATA_URL,
                        timestamp,
                        JSON.stringify(d),
                        'json'
                    );

                    ir.setLocation(
                        "US",
                        stateCode,
                        d.City
                    );

                    if(d['Link to news article or photo of official document'].length > 0) {
                        ir.addEvidenceLink(d['Link to news article or photo of official document']);
                    }

                    if(d['URL of image of victim'].length > 0) {
                        ir.addEvidenceLink(d['URL of image of victim']);
                    }

                    ir.setVictimRace(d["Victim's race"]);
                    ir.setVictimAge(d["Victim's age"]);
                    ir.setVictimGender(d["Victim's gender"]);
                    ir.setVictimArmed(d.Unarmed);

                    let additionalEvidence = {
                        victim_name: d["Victim's name"],
                        victim_age: d["Victim's age"],
                        victim_gender: d["Victim's gender"],
                        victim_race: d["Victim's race"],
                        address_of_incident: d['Street Address of Incident'],
                        city: d.City,
                        state: d.State,
                        zipcode: d.Zipcode,
                        county: d.County,
                        agency_responsible_for_death: d['Agency responsible for death'],
                        cause_of_death: d['Cause of death'],
                        official_disposition_of_death: d['Official disposition of death (justified or other)'],
                        criminal_charges: d['Criminal Charges?'],
                        mental_illness: d['Symptoms of mental illness?'],
                        unarmed: d.Unarmed,
                        alleged_weapon: d['Alleged Weapon (Source: WaPo)'],
                        alleged_threat_level: d['Alleged Threat Level (Source: WaPo)'],
                        fleeing: d['Fleeing (Source: WaPo)'],
                        body_camera: d['Body Camera (Source: WaPo)'],
                        wapo_id: d['WaPo ID (If included in WaPo database)'],
                        off_duty_killing: d['Off-Duty Killing?'],
                        geography: d[ 'Geography (via Trulia methodology based on zipcode population density: http://jedkolko.com/wp-content/uploads/2015/05/full-ZCTA-urban-suburban-rural-classification.xlsx )'],
                        image_of_victim: d['URL of image of victim']
                    };

                    let evidence = {
                        type: "text",
                        data: additionalEvidence
                    };

                    ir.setEvidenceAdditional(evidence);

                    try {
                        let dbInsRes = await this.addReportToBb(ir);
                        console.log("mpv-id:", d.ID, "inserted into db:", dbInsRes);
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

module.exports = MappingPoliceViolence;
