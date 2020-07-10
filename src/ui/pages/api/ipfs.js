import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
const handler = nextConnect();

const PAC_CONFIG = require('../../../common/constants');

handler.use(middleware);

handler.get(async (req, res) => {
    let data = await req.db.collection(PAC_CONFIG.IPFS_HISTORY_COLLECTION)
        .find({type: 'db_backup'}, {projection:{ _id: 0 }})
        .sort({ timestamp: -1 })
        .limit(10).toArray();

    res.json(data);
});

export default handler;
