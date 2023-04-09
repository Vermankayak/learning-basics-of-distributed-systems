const http = require("http");
const server = http.createServer((req, res) => {
    console.log("current conn", server._connection);
    setTimeout(() => res.end("OK"), 10_000);
})
//server.maxConnections = 2;
server.listen(3020, "localhost")