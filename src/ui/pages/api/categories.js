import nextConnect from 'next-connect';
import middleware from '../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    let { cat } = req.query;
    let categories = {};
    let realYears = [];
    let vals;
    switch(cat) {
        case 'age':
            vals = await req.db.collection('incident_reports').distinct( 'victimAge' );
            categories.age = vals;
            break;
        case 'race':
            vals = await req.db.collection('incident_reports').distinct( 'victimRace' );
            categories.race = vals;
            break;
        case 'gender':
            vals = await req.db.collection('incident_reports').distinct( 'victimGender' );
            categories.gender = vals;
            break;
        case 'state':
            vals = await req.db.collection('incident_reports').distinct( 'locationStateCode' );
            categories.state = vals;
            break;
        case 'country':
            vals = await req.db.collection('incident_reports').distinct( 'locationCountry' );
            categories.country = vals;
            break;
        case 'year':
            vals = await req.db.collection('incident_reports').distinct( 'year' );
            realYears = [];
            for(let i = 0; i < vals.length; i++) {
                if(vals[i] > 1973) {
                    realYears.push(vals[i]);
                }
            }
            categories.year = realYears;
            break;
        case 'month':
            vals = await req.db.collection('incident_reports').distinct( 'month' );
            categories.month = vals;
            break;
        case 'all':
        default:
            vals = await req.db.collection('incident_reports').distinct( 'victimAge' );
            categories.age = vals;
            vals = await req.db.collection('incident_reports').distinct( 'victimRace' );
            categories.race = vals;
            vals = await req.db.collection('incident_reports').distinct( 'victimGender' );
            categories.gender = vals;
            vals = await req.db.collection('incident_reports').distinct( 'locationStateCode' );
            categories.state = vals;
            vals = await req.db.collection('incident_reports').distinct( 'locationCountry' );
            categories.country = vals;
            vals = await req.db.collection('incident_reports').distinct( 'year' );

            realYears = [];
            for(let i = 0; i < vals.length; i++) {
                if(vals[i] > 1973) {
                    realYears.push(vals[i]);
                }
            }
            categories.year = realYears;
            vals = await req.db.collection('incident_reports').distinct( 'month' );
            categories.month = vals;
            break;
    }
    res.json(categories);
});

export default handler;
