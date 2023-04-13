const fastify = require("fastify");
const fs = require("fs");
const path = require("path");
const https = require("https");
const fetch = require("node-fetch");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "127.0.0.1:4000";
const log = require("./logstash.js");

const server = fastify();

const options = {
    // agent: new https.Agent({
    //     ca:fs.readFileSync(path.join(__dirname, "../shared/tls", "ca-certificate.cert"))
    // })
};
(
    async() =>{
        await server.register(require("middie"));
        server.use((req, res, next) => {
            log("info", "request-incoming", {
                path: req.url, method: req.method, ip: req.ip,
                ua: req.headers["user-agent"] || null});
                next();
            });
        server.setErrorHandler(async (error, req) => {
            log("error", "request-failure", { stack: error.stack,
                path: req.url, method: req.method,});
                return {error: error.message};
        });
        server.get("/", async() => {
            const url = `http://${TARGET}/recipes/42`;
            log("info", "request-outgoing", { url, svc:"recipe-api"});
            const req = await fetch();
            const producer_data = await req.json();

            return {
                consumer_pid: process.pid,
                producer_data
            };
        });
        server.get("/error", async() => {
            throw new Error("oh no");
        });
        server.listen(PORT, HOST, () => {
            log("verbose","listen",{host: HOST, port: PORT})
        });
})();

