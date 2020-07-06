import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
const UsStates = require('us-state-codes');
import { formatSource } from '../../utils/source'

const PAC_CONFIG = require('../../../common/constants');

const handler = nextConnect();

handler.use(middleware);

const processCategory = async(collection, cat) => {
    let catVals = [];
    let vals = await collection.distinct( cat );

    switch(cat) {
        case 'victimAge':
            for(let i = 0; i < vals.length; i++) {
                if(vals[i] >= 18 && vals[i] <= 80) {
                    let c = {
                        val: vals[i],
                        name: vals[i]
                    }
                    catVals.push(c);
                }
            }
            break;
        case 'year':
            for(let i = 0; i < vals.length; i++) {
                if(vals[i] > 1973) {
                    let c = {
                        val: vals[i],
                        name: vals[i]
                    }
                    catVals.push(c);
                }
            }
            catVals = catVals.reverse();
            break;
        case 'source':
            for(let i = 0; i < vals.length; i++) {
                let c = {
                    val: vals[i],
                    name: formatSource(vals[i])
                }
                catVals.push(c);
            }
            break;
        case 'locationStateCode':
            for(let i = 0; i < vals.length; i++) {
                let c = {
                    val: vals[i],
                    name: UsStates.getStateNameByStateCode(vals[i])
                }
                catVals.push(c);
            }
            break;
        default:
            for(let i = 0; i < vals.length; i++) {
                let c = {
                    val: vals[i],
                    name: vals[i]
                }
                catVals.push(c);
            }
            break;
    }

    return catVals;
}

handler.get(async (req, res) => {
    let { cat } = req.query;
    let collection = req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION);
    let categories = {};
    let armedFilter = [
        {val: 'N/A', name: 'N/A'},
        {val: 'Armed', name: 'Armed'},
        {val: 'Unarmed', name: 'Unarmed'},
        {val: 'Unclear', name: 'Unclear'},
        {val: 'Allegedly', name: 'Allegedly'}
    ];
    switch(cat) {
        case 'age':
            categories.age = await processCategory(collection, 'victimAge');
            break;
        case 'race':
            categories.race = await processCategory( collection, 'victimRace' );
            break;
        case 'gender':
            categories.gender = await processCategory( collection, 'victimGender' );
            break;
        case 'armed':
            categories.armed = armedFilter;
            break;
        case 'state':
            categories.state = await processCategory( collection, 'locationStateCode' );
            break;
        case 'country':
            categories.country = await processCategory( collection, 'locationCountry' );
            break;
        case 'year':
            categories.year = await processCategory( collection, 'year' );
            break;
        case 'month':
            categories.month = await processCategory( collection, 'month' );
            break;
        case 'source':
            categories.source = await processCategory( collection, 'source' );
            break;
        case 'all':
        default:
            categories.age = await processCategory(collection, 'victimAge');
            categories.race = await processCategory( collection, 'victimRace' );
            categories.gender = await processCategory( collection, 'victimGender' );
            categories.armed = armedFilter;
            categories.state = await processCategory( collection, 'locationStateCode' );
            categories.country = await processCategory( collection, 'locationCountry' );
            categories.year = await processCategory( collection, 'year' );
            categories.month = await processCategory( collection, 'month' );
            categories.source = await processCategory( collection, 'source' );
            break;
    }
    res.json(categories);
});

export default handler;
