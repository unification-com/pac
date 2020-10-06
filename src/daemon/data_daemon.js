require('dotenv').config();

// APIs & Data sources
const PoliceBrutality2020 = require('./apis/2020pb');
const FatalEncountersDotOrg = require('./apis/fatal_encounters');
const GuardianTheCounted = require('./apis/guardian_the_counted');
const KilledByPolice = require('./apis/killed_by_police');
const MappingPoliceViolence = require('./apis/mapping_police_violence');
const USPoliceShootings = require('./apis/us_police_shootings');
const WashingtonPost = require('./apis/washington_post');

class DataDaemon {
    constructor(_mongoClient) {
        this.mongoClient = _mongoClient;

        let API_LIMIT = -1;

        this.pb = new PoliceBrutality2020(this.mongoClient, API_LIMIT);
        this.wp = new WashingtonPost(this.mongoClient, API_LIMIT);
        this.fe = new FatalEncountersDotOrg(this.mongoClient, API_LIMIT);
        this.kbp = new KilledByPolice(this.mongoClient, API_LIMIT);
        this.usps = new USPoliceShootings(this.mongoClient, API_LIMIT);
        this.mpv = new MappingPoliceViolence(this.mongoClient, API_LIMIT);
        this.gtc = new GuardianTheCounted(this.mongoClient, API_LIMIT);
    }

    async runDbUpdates() {
        const start = new Date();

        Promise.all([
            this.pb.run(),
            this.wp.run(),
            this.fe.run(),
            this.kbp.run(),
            this.usps.run(),
            this.mpv.run(),
            this.gtc.run()
        ]).then((values) => {
            console.log("pbUpRes", values[0]);
            console.log("wpUpRes", values[1]);
            console.log("feUpRes", values[2]);
            console.log("kbpUpRes", values[3]);
            console.log("uspsUpRes", values[4]);
            console.log("mpvUpRes", values[5]);
            console.log("gtcUpRes", values[6]);

            const end = new Date();

            const timeTaken = (end.getTime() - start.getTime()) / 1000;

            console.log("api updates complete in ", timeTaken, "seconds");
            process.exit()
        }).catch(function (err) {
            console.error(err);
            process.exit()
        });
    }
}

module.exports = DataDaemon;
