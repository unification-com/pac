const IncidentReport = require('../../common/incident_report.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const ReportApi = require('./api');
const Media = require('./structs/media')

const { fetchData, sleepFor } = require('../../common/utils');

const SOURCE_NAME = "2020PoliceBrutality";

const BASE_DATA_URL = "https://raw.githubusercontent.com/2020PB/police-brutality/data_build/all-locations.json";
const GEO_DATA_API_URL = "https://api.846policebrutality.com/api/incidents/";
const IPFS_ARCHIVE_URL = "https://gateway.temporal.cloud/ipfs/QmVP7hHyBVzQrDkdTUYww793oa6p4jNBD3c6AqgWvkn1Mp/pb2020";

class PoliceBrutality2020 extends ReportApi {
    constructor(_dbOptions, _limit = -1) {
        super(_dbOptions, _limit);
        this.ipfsArchive = null;
    }

    async run() {
        let self = this;
        console.log("start", SOURCE_NAME);
        return new Promise((resolve) => {
            Promise.all([fetchData(BASE_DATA_URL), fetchData(IPFS_ARCHIVE_URL)]).then((values) => {
                self.baseData = values[0];
                let ipfsHtml = values[1];
                self.ipfsArchive = new JSDOM(ipfsHtml);
                self.processData(function(status) {
                    resolve(status);
                });
            }).catch(console.error);
        });
    }

    async processData(processCompleteCallback) {
        if(this.baseData !== null) {
            let i = 0;
            let numRecords = this.baseData.data.length;
            for (let d of this.baseData.data) {
                i++;
                // first search the collection to see if it's already been recorded
                if(d.id === undefined) {
                    continue;
                }

                if(this.limit > 0 && this.limit === i) {
                    processCompleteCallback(true);
                    return;
                }

                console.log(SOURCE_NAME, ": process", i, "/", numRecords, "pb-id:", d.id);

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

                    // first fill out the basic data from the original data source
                    ir.setTitle(d.name);
                    let date = Date.parse(d.date);
                    let timestamp = Math.round(date / 1000);
                    ir.setSource(
                        SOURCE_NAME,
                        d.id,
                        BASE_DATA_URL,
                        timestamp,
                        JSON.stringify(d),
                        'json'
                    );
                    ir.addAdditionalSourceData(d.edit_at);

                    ir.setContent("");

                    ir.setVictimRace('');
                    ir.setVictimAge(0);
                    ir.setVictimGender('');
                    ir.setVictimArmed('');

                    ir.setLocation(
                        "US",
                        d.state,
                        d.city);

                    for(let i = 0; i < d.links.length; i++) {
                        ir.addEvidenceLink(d.links[i]);
                    }

                    // get additional data
                    let url = GEO_DATA_API_URL + d.id + '?include=evidence';
                    ir.addAdditionalSourceData(url);
                    Promise.all([fetchData(url), this.fetchIpfsLinks(d.id)]).then(async (values) => {
                        let doInsert = true;
                        let geoLocation;
                        let evidenceArray;

                        try {
                            geoLocation = values[0].data[0].geocoding;
                            evidenceArray = values[0].data[0].evidence;
                        } catch (err) {
                            console.log("additional data err:", err);
                            doInsert = false;
                        }

                        if(doInsert === true) {
                            ir.setGeoLocation(geoLocation.lat, geoLocation.long);
                            if (evidenceArray) {

                                let videos = [];
                                for(let j = 0; j < evidenceArray.length; j++) {
                                    let vidArray = evidenceArray[j];
                                    let videoObj = new Media('video');
                                    videoObj.setTitle(vidArray.video[0].title);
                                    videoObj.setDescription(vidArray.video[0].description);
                                    videoObj.setUrl(vidArray.url);
                                    videoObj.setStatus(vidArray.video_status);
                                    let vidSourceSite = vidArray.video[0].site;
                                    let n = vidSourceSite.search("tiktok.com");
                                    if(n > -1) {
                                        vidSourceSite = 'tiktok';
                                    }
                                    videoObj.setSourceSite(vidSourceSite);
                                    videoObj.setThumbnail(vidArray.video[0].thumbnail);
                                    if(vidArray.video[0].tags.length > 0) {
                                        for(let k = 0; k < vidArray.video[0].tags.length; k++) {
                                            videoObj.addTag(vidArray.video[0].tags[k]);
                                        }
                                    }
                                    for(let l = 0; l < vidArray.video[0].streams.length; l++) {
                                        videoObj.addMedia(vidArray.video[0].streams[l].url, vidArray.video[0].streams[l].format, 'video');
                                    }
                                    videos.push(videoObj.getMediaObj());
                                }

                                let evidence = {
                                    type: "media",
                                    data: videos
                                }
                                ir.setEvidenceAdditional(evidence);
                            }
                            if (values[1] !== null && typeof values[1] === 'object') {
                                for (let i = 0; i < values[1].length; i++) {
                                    ir.addEvidenceIpfsArchiveLink(values[1][i])
                                }
                            }
                            try {
                                let dbInsRes = await this.addReportToBb(ir);
                                console.log("pb-id:", d.id, "inserted into db:", dbInsRes);
                            } catch (dbErr) {
                                console.log("db inster err:", dbErr);
                            }
                        }
                    }).catch(console.error);

                    // let's not hammer the APIs
                    console.log("wait...");
                    await sleepFor(1000);
                }
            }
            console.log(SOURCE_NAME, "update complete");
            processCompleteCallback(true);
        }
    }

    fetchIpfsLinks(id) {
        let self = this;
        let links = [];
        return new Promise((resolve, reject) => {
            self.ipfsArchive.window.document.querySelectorAll('a').forEach(link => {
                let linkHref = link.href;
                let n = linkHref.search(id);
                if(n > -1) {
                    links.push(linkHref);
                }

            });
            resolve(links);
        });
    }

}

module.exports = PoliceBrutality2020;