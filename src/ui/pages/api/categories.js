import nextConnect from 'next-connect';
import middleware from '../../middleware/database';

const PAC_CONFIG = require('../../../common/constants');

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    let { cat } = req.query;
    let categories = {};
    let realYears = [];
    let vals;
    switch(cat) {
        case 'age':
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'victimAge' );
            categories.age = vals;
            break;
        case 'race':
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'victimRace' );
            categories.race = vals;
            break;
        case 'gender':
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'victimGender' );
            categories.gender = vals;
            break;
        case 'state':
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'locationStateCode' );
            categories.state = vals;
            break;
        case 'country':
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'locationCountry' );
            categories.country = vals;
            break;
        case 'year':
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'year' );
            realYears = [];
            for(let i = 0; i < vals.length; i++) {
                if(vals[i] > 1973) {
                    realYears.push(vals[i]);
                }
            }
            categories.year = realYears;
            break;
        case 'month':
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'month' );
            categories.month = vals;
            break;
        case 'source':
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'source' );
            categories.source = vals;
            break;
        case 'all':
        default:
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'victimAge' );
            categories.age = vals;
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'victimRace' );
            categories.race = vals;
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'victimGender' );
            categories.gender = vals;
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'locationStateCode' );
            categories.state = vals;
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'locationCountry' );
            categories.country = vals;
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'year' );


            realYears = [];
            for(let i = 0; i < vals.length; i++) {
                if(vals[i] > 1973) {
                    realYears.push(vals[i]);
                }
            }
            categories.year = realYears;
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'month' );
            categories.month = vals;
            vals = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).distinct( 'source' );
            categories.source = vals;
            break;
    }
    res.json(categories);
});

export default handler;
