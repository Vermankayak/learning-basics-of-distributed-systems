const fs = require("fs");
const fastify = require("fastify");
const path = require("path");

const server = fastify(
        // {
        //     https:{
        //         key:fs.readFileSync(path.join(__dirname, "./tls", "producer-private-key.key")),
        //         cert:fs.readFileSync(path.join(__dirname, "../shared/tls", "producer-certificate.cert"))
        //     }
        // }
);

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

server.get("/recipes/:id", async(req, reply) => {
    const id = parseInt(req.params.id);
    if(id !== 42){
        reply.statusCode = 404;
        return { error: "not_found" }
    }
    return {
        producer_pid: process.pid,
        recipe: {
            id,
            name:"Chicken Tikka Masala",
            steps: "Throw it in a pot ...",
            ingredients: [
                { id:1, name:"Chicken", quantity: "1 lb"},
                { id:2, name:"Sauce", quantity:"2 cups"}
            ]
        }
    };
});

server.listen(PORT, HOST, () => {
    console.log(`Producer running at http://${HOST}:${PORT}`)
});