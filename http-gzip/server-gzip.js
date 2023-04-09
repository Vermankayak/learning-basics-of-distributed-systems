const zlib = require("zlib");
const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {
    const raw = fs.createReadStream(__dirname + "/index.html");
    const acceptEncoding = req.headers["accept-encoding"] || "";
    console.log("accept-encoding", acceptEncoding)
    res.setHeader("Content-type", "text/plain");

    if(acceptEncoding.includes("gzip")){
        res.setHeader('Content-Encoding', 'gzip');
        raw.pipe(zlib.createGzip()).pipe(res)
    }else{
        raw.pipe(res)
    }
}).listen(process.env.PORT || 4000);