import nextConnect from 'next-connect';
import middleware from '../../middleware/database';
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    res.json(await req.db.collection('incident_reports').find().count());
});

export default handler;
