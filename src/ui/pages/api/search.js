import nextConnect from 'next-connect';
import middleware from '../../middleware/database';

const PAC_CONFIG = require('../../../common/constants');

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    let { page } = req.query;
    let pageNo = parseInt(page)
    if(!pageNo) {
        pageNo = 1
    }

    let dbQuery = {};

    if('term' in req.query) {
        let { term } = req.query;
        if(term.length === 64 && term.match(/^[0-9A-Z]+$/)) {
            dbQuery.mainchainTxHash = term;
        } else {
            dbQuery = {
                $or: [
                    {
                        victimName: { $regex:  new RegExp(term, "i") }
                    },
                    {
                        locationCity: { $regex:  new RegExp(term, "i") }
                    },
                    {
                        locationState: { $regex:  new RegExp(term, "i") }
                    }
                ]
            }
        }
    }

    let limit = 20;
    let skip = ( pageNo - 1 ) * limit

    let numRows = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).find(dbQuery).count();
    let numPages = Math.floor(numRows / limit);
    numPages = (numPages === 0)?1:numPages;

    let data = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION)
        .find(dbQuery)
        .sort({ sourceDatetime: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit)).toArray();

    let dataResults = {
        data: data,
        pages: {
            totalPages: numPages,
            total: numRows,
            currentPage: pageNo
        }
    }
    res.json(dataResults);
});

export default handler;
