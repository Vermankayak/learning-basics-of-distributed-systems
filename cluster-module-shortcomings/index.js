const fastify = require("fastify");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

const server = fastify();

server.get("/:limit", async(req, reply) => {
    await sleep(10);
    return String(fibonacci(Number(req.params.limit)));
});

server.listen(PORT, HOST)

function fibonacci(limit){
    let prev = 1n;
    let next = 0n;
    let swap;

    while(limit){
        swap = prev;
        prev = prev + next;
        next = swap;
        limit--;
    }
    return next;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}