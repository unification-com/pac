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
        console.log(start, "START API UPDATES");

        try {
            const pbUpRes = await this.pb.run()
            console.log("pbUpRes", pbUpRes)
        } catch(err) {
            console.error("pbUpRes error", err);
            process.exit()
        }

        try {
            const wpUpRes = await this.wp.run()
            console.log("wpUpRes", wpUpRes)
        } catch(err) {
            console.error("wpUpRes error", err);
            process.exit()
        }

        try {
            const feUpRes = await this.fe.run()
            console.log("feUpRes", feUpRes)
        } catch(err) {
            console.error("feUpRes error", err);
            process.exit()
        }

        try {
            const kbpUpRes = await this.kbp.run()
            console.log("kbpUpRes", kbpUpRes)
        } catch(err) {
            console.error("kbpUpRes error", err);
            process.exit()
        }

        try {
            const uspsUpRes = await this.usps.run()
            console.log("uspsUpRes", uspsUpRes)
        } catch(err) {
            console.error("uspsUpRes error", err);
            process.exit()
        }

        try {
            const mpvUpRes = await this.mpv.run()
            console.log("mpvUpRes", mpvUpRes)
        } catch(err) {
            console.error("mpvUpRes error", err);
            process.exit()
        }

        try {
            const gtcUpRes = await this.gtc.run()
            console.log("gtcUpRes", gtcUpRes)
        } catch(err) {
            console.error("gtcUpRes error", err);
            process.exit()
        }

        const end = new Date();

        const timeTaken = (end.getTime() - start.getTime()) / 1000;

        console.log("api updates complete in ", timeTaken, "seconds");
        console.log(end, "END API UPDATES");
        process.exit()
    }
}

module.exports = DataDaemon;
