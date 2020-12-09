const Crawler = require("crawler");
const fs = require("fs");
const file = fs.createWriteStream("./names.txt", { flags: "a" });

const RATE_LIMIT = 0;
const MAX_CONNECTIONS = 3;
const START_FROM = 1364351;
const END_AT = 5000000;
const TIMEOUT = 5000;
const RETRIES = 1;
const RETRY_TIMEOUT = 1000;
const URL = ``;
const names = new Set();
const time = Date.now();

const crawler = new Crawler({
    maxConnections: MAX_CONNECTIONS,
    rateLimit: RATE_LIMIT,
    timeout: TIMEOUT,
    retries: RETRIES,
    retryTimeout: RETRY_TIMEOUT,
    callback: function (err, res, done) {
        res.$(".ranking-container td:nth-child(3)").each((index, element) => {
            const name = res.$(element).text().trim();
            const hasIllegalChars = /[^a-zA-Z0-9]/.test(name);
            if (!hasIllegalChars) {
                file.write(`${name}\n`);
            }
        });

        console.log(`finished task #${res.options.pageIndex} in ${Math.round((Date.now() - time) / 1000) + "s"}`);
        done();
    },
});

for (let i = START_FROM; i < END_AT; i += 5) {
    crawler.queue({
        uri: URL + i,
        pageIndex: i,
    });
}

crawler.on("drain", function () {
    console.log("Done", names);
});
