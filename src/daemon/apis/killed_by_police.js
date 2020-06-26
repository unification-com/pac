const CSVParse = require('csv-parse/lib/sync');
const UsStates = require('us-state-codes');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const IncidentReport = require('../../common/incident_report.js');
const {fetchData, sleepFor} = require('../../common/utils');
const ReportApi = require('./api');

const SOURCE_NAME = "KilledByPolice";

const BASE_DATA_URL = "https://killedbypolice.net";

class KilledByPolice extends ReportApi {
    constructor(_mongoClient, _limit = -1) {
        super(_mongoClient, _limit);
    }

    async run() {
        let self = this;
        console.log("start", SOURCE_NAME);
        return new Promise((resolve) => {
            Promise.all([
                fetchData(BASE_DATA_URL + '/kbp2015'),
                fetchData(BASE_DATA_URL + '/kbp2016'),
                fetchData(BASE_DATA_URL + '/kbp2017'),
                fetchData(BASE_DATA_URL + '/kbp2018'),
                fetchData(BASE_DATA_URL + '/kbp2019'),
                fetchData(BASE_DATA_URL + '/kbp2020')
            ]).then((values) => {
                self.baseData = values;
                self.processData(function(status) {
                    resolve(status);
                });
            }).catch(console.error);
        });
    }

    extractPageData(page) {
        let dataArray = [];
        let dom = new JSDOM(page);
        dom.window.document.querySelectorAll('tr').forEach(tr => {

            let rowData = {};

            // no source ID so need to generate one
            let sourceId = '';
            let timestamp = 0;
            let dateFormatted = '';
            let name = '';
            let age = '';
            let gender = '';
            let stateCode = '';
            let stateName = '';
            let race = '';
            let armed = '';
            let links = [];

            let rawData = {};

            // first extract the data from each cell for this row
            tr.querySelectorAll('td').forEach(td => {
                let key = td.getAttribute('data-label').replace(/[\W_]+/g,"");
                switch (key) {
                    case 'Date':
                        let date = new Date(td.textContent);
                        const month = date.toLocaleString('default', { month: 'long' });
                        dateFormatted = date.getDate() + ' ' + month + ' ' + date.getFullYear();
                        timestamp = Math.round(date / 1000);
                        rawData['Date'] = td.textContent;
                        rowData.timestamp = timestamp;
                        rowData.dateFormatted = dateFormatted;
                        break;
                    case 'Name':
                        name = td.textContent
                        rawData['Name'] = name;
                        rowData.name = name;
                        break;
                    case 'Age':
                        age = td.textContent
                        rawData['Age'] = age;
                        rowData.age = age;
                        break;
                    case 'Gender':
                        gender = td.textContent
                        rawData['Gender'] = gender;
                        rowData.gender = gender;
                        break;
                    case 'Race':
                        race = td.textContent;
                        rawData['Race'] = race;
                        rowData.race = race;
                        break;
                    case 'State':
                        stateCode = UsStates.sanitizeStateCode(td.textContent);
                        stateName = UsStates.getStateNameByStateCode(stateCode);
                        rawData['State'] = td.textContent;
                        rowData.stateCode = stateCode;
                        rowData.stateName = stateName;
                        break;
                    case 'Armed':
                        armed = td.textContent;
                        rawData['Armed'] = armed;
                        rowData.armed = armed;
                        break;
                    case 'Source':
                        rawData['Source'] = [];
                        td.querySelectorAll('a').forEach(a => {
                            links.push(a.href);
                        });
                        rawData['Source'] = links;
                        rowData.links = links;
                        break;
                }
            });
            if(timestamp > 0) {
                // need to generate a source ID, since the source doesn't have a native ID.
                sourceId = stateCode + '-' + timestamp + '-' + name.replace(/[\W_]+/g, "-");
                rowData.sourceId = sourceId;
                rowData.rawData = rawData;
                dataArray.push(rowData);
            }
        });
        return dataArray;
    }

    async processData(processCompleteCallback) {
        if (this.baseData !== null) {
            let numPages = this.baseData.length;
            let pageNum = 1;
            for(let page of this.baseData) {
                let pageData = this.extractPageData(page);
                let numRecords = pageData.length;
                let i = 0;
                for(let d of pageData) {
                    i++;
                    if(this.limit > 0 && this.limit === i) {
                        processCompleteCallback(true);
                        return;
                    }
                    console.log(SOURCE_NAME, ": process page", pageNum, "/", numPages, ", record:", i, "/", numRecords, "kbp-id:", d.sourceId);
                    let report = await this.collection.find({
                        $and: [{source: SOURCE_NAME}, {sourceId: d.sourceId}],
                    }).limit(1).toArray();

                    if(report.length > 0) {
                        console.log(SOURCE_NAME, d.sourceId, "already recorded. Update potential cross references for", report[0]._id);
                        try {
                            let crRes = await this.updateCrossReferences(report[0]._id);
                            console.log("has cross references:", crRes)
                        } catch(crErr) {
                            console.log("cross reference update error:", crErr)
                        }
                    } else {
                        let ir = new IncidentReport();

                        // first fill out the basic data from the original data source
                        let title = d.name + ( (parseInt(d.age) > 0) ?  ', ' + d.age : '' ) + ', from ' + d.stateName
                            + ' on ' + d.dateFormatted;
                        ir.setTitle(title);

                        ir.setSource(
                            SOURCE_NAME,
                            d.sourceId,
                            BASE_DATA_URL,
                            d.timestamp,
                            JSON.stringify(d.rawData),
                            'json'
                        );

                        ir.setContent("");

                        ir.setVictimName(d.name);

                        ir.setLocation(
                            "US",
                            d.stateCode,
                            ""
                        );

                        for(let i = 0; i < d.links.length; i++) {
                            ir.addEvidenceLink(d.links[i]);
                        }

                        ir.setVictimRace(d.race);
                        ir.setVictimAge(d.age);
                        ir.setVictimGender(d.gender);
                        ir.setVictimArmed('');

                        let additionalEvidence = {
                            gender: d.gender,
                            race: d.race,
                            armed: d.armed,
                        }

                        let evidence = {
                            type: "text",
                            data: additionalEvidence
                        };

                        ir.setEvidenceAdditional(evidence);

                        try {
                            let dbInsRes = await this.addReportToDb(ir);
                            console.log("kbp-id:", d.sourceId, "inserted into db:", dbInsRes);
                        } catch(dbErr) {
                            console.log("db inster err:", dbErr);
                        }
                        await sleepFor(50);
                    }
                }
                pageNum++;
            }
            console.log(SOURCE_NAME, "update complete")
            processCompleteCallback(true);
        }
    }
}

module.exports = KilledByPolice;