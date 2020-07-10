import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
const handler = nextConnect();

const PAC_CONFIG = require('../../../common/constants');

handler.use(middleware);

handler.get(async (req, res) => {
    res.json(await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).find().count());
});

export default handler;
