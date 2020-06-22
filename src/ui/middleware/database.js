import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const client = new MongoClient(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
});

async function database(req, res, next) {
    if (!client.isConnected()) await client.connect();
    req.dbClient = client;
    req.db = client.db(process.env.MONGODB_DBNAME);
    return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;