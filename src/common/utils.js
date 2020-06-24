require('dotenv').config();
const Axios = require("axios");
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    fetchData: (url) => {
        return new Promise((resolve, reject) => {
            console.log("fetch", url)
            Axios.get(url)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.log("error fetching", url, error.toString());
                    reject(error.toString());
                });
        });
    },

    downloadFile: async (url, destFilePath) => {
        console.log("download", url, ", save to", destFilePath);
        const res = await fetch(url);
        return new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream(destFilePath);
            res.body.pipe(fileStream);
            res.body.on("error", (err) => {
                reject(err);
            });
            fileStream.on("finish", function() {
                resolve(true);
            });
        });
    },

    sleepFor: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    mongoDbUrl: (withDbName = false)  => {
        let mongoUrl;
        // backwards compatibility
        if(process.env.MONGODB_URL !== '' && process.env.MONGODB_URL !== undefined && process.env.MONGODB_URL !== null) {
            mongoUrl = process.env.MONGODB_URL;
            if(withDbName) {
                mongoUrl = mongoUrl + '/' + process.env.MONGODB_DBNAME;
            }
            return mongoUrl;
        }

        // New method for storing DB info in .env
        let mongoProtocol = 'mongodb://';
        let mongoUserPass = '';
        if((process.env.MONGODB_DBUSER !== '' && process.env.MONGODB_DBUSER !== undefined && process.env.MONGODB_DBUSER !== null)
         && (process.env.MONGODB_DBPASS !== '' && process.env.MONGODB_DBPASS !== undefined && process.env.MONGODB_DBPASS !== null)) {
            mongoUserPass = process.env.MONGODB_DBUSER + ':' + process.env.MONGODB_DBPASS + '@';
        }
        mongoUrl = mongoProtocol + mongoUserPass + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT;

        if(withDbName) {
            mongoUrl = mongoUrl + '/' + process.env.MONGODB_DBNAME;
        }
        return mongoUrl;
    },
};
