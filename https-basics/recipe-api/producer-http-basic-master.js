const cluster = require("cluster");
const path = require("path");
console.log(`master pid=${process.pid}`);
cluster.setupMaster({
    exec: path.join(__dirname, "producer-https-basic.js")
});

cluster.fork();
cluster.fork();

cluster.on("disconnect", (worker) => {
    console.log("disconnect", worker.id);
}).on("exit", (worker, code, signal) => {
    console.log("exit", worker.id, code, signal);
}).on("listening", (worker, {address, port}) => {
    console.log("listening", worker.id, `${address}:${port}`)
})