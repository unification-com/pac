import nextConnect from 'next-connect';
import middleware from '../../middleware/database';

const PAC_CONFIG = require('../../../common/constants');

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const { beaconHash } = req.query;
    let ret = {};
    let doc = await req.db.collection(PAC_CONFIG.INCIDENT_REPORT_COLLECTION).findOne({beaconHash: beaconHash}, {projection:{ _id: 0 }});
    if(doc) {
        ret.status = true;
        ret.error = '';
        ret.result = doc;

    } else {
        ret.status = false;
        ret.error = 'Hash: "' + beaconHash + '" not found';
        ret.result = {};
    }
    res.json(ret);
});

export default handler;
