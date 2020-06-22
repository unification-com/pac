import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const { beaconHash } = req.query;
    let doc = await req.db.collection('incident_reports').findOne({beaconHash: beaconHash});
    res.json(doc);
});

export default handler;
