const express = require("express");
const {expressMiddleware} = require("zipkin-instrumentation-express");
const tracer = require("./tracer");

const server = express();

server.use(expressMiddleware({tracer}));

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

server.get("/recipes/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    if(id !== 42){
        res.statusCode = 404;
        return res.send({ error: "not_found" })
    }
    return res.send({
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
    });

});

server.listen(PORT, HOST, () => {
    console.log(`Producer running at http://${HOST}:${PORT}`)
});