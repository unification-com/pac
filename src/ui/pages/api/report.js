import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const { beaconHash } = req.query;
    let doc = await req.db.collection('incident_reports').findOne({ beaconHash: beaconHash });
    doc.totalPages = await req.db.collection('incident_reports').find().count();
    res.json(doc);
});

export default handler;
