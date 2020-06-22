import nextConnect from 'next-connect';
import middleware from '../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    let { page } = req.query;
    let pageNo = parseInt(page)
    if(pageNo < 0 || pageNo === 0) {
        pageNo = 1
    }

    let limit = 20;
    let skip = ( pageNo - 1 ) * limit

    let numRows = await req.db.collection('incident_reports').find({}).count();
    let numPages = Math.floor(numRows / limit);

    let data = await req.db.collection('incident_reports')
        .find()
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
