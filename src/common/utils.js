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
    }
};