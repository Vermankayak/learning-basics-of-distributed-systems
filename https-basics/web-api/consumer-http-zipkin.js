const express = require("express");
const {expressMiddleware} = require("zipkin-instrumentation-express");
const zipkinFetch = require("./fetchWrapper");
const tracer = require("./tracer");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "127.0.0.1:4000";

// const ZIPKIN = process.env.ZIPKIN || "localhost:9411";

// const zipkin = new Zipkin({
//     zipkinHost: ZIPKIN,
//     serviceName: "web-api", servicePort: PORT, serviceIp: HOST, init: "short"
// });
const server = express();

server.use(expressMiddleware({tracer}));
// server.addHook("onRequest", zipkin.onRequest());
// server.addHook("onResponse", zipkin.onResponse());


server.get("/", async(req, res) => {
    // req.zipkin.setName("get_root");
    const url = `http://${TARGET}/recipes/42`;
    // const zreq = req.zipkin.prepare();
    const recipe = await zipkinFetch(url);
    // zreq.complete("GET", url)
    const producer_data = await recipe.json();

    return res.send({
        consumer_pid: process.pid,
        producer_data
    });
});

server.get("/health", async () => {
    console.log("health check");
    return res.send("OK");
})

server.listen(PORT, HOST, () => {
    console.log(`Consumer running at http://${HOST}:${PORT}/`)
})