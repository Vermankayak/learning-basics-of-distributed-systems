const fastify = require("fastify");
const HOST = "0.0.0.0";
const PORT = 3300;
const redis = new (require("ioredis"))({enableOfflineQueue: false});
const pg = new (require("pg").Client)();
pg.connect();
const server = fastify();
server.get("/health", async(req, reply) => {
    try{
        const res = await pg.query("SELECT $1::text as status", ["ACK"]);
        if(res.rows[0].status!=="ACK"){
            return reply.code(500).send("DOWN");
        }
    }catch(e){
        return reply.code(500).send("DOWN");
    }

    let status = "OK";
    try{
        if (await redis.ping() !== "PONG") status = "DEGRADED";
    }catch(e){
        status = "DEGRADED";
    }
    return reply.code(200).send(status);
});

server.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}`));