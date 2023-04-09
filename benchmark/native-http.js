const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 4000;

require("http").createServer((req, res) => {
    res.end("OK");
}).listen(PORT, () => {
    console.log(`Producer running at http://${HOST}:${PORT}`)
})