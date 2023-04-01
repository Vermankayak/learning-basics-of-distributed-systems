const util = require("util");
const grpc = require("@grpc/grpc-js");
const fastify = require("fastify");
const path = require("path");
const loader = require("@grpc/proto-loader");

const server = fastify();
const pkg_def = loader.loadSync(path.join(__dirname, "../shared/grpc-recipe.proto"));
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "localhost:4000";

const client = new recipe.RecipeService(
    TARGET,
    grpc.credentials.createInsecure()
);

const getMetaData = util.promisify(client.getMetaData).bind(client);
const getRecipe = util.promisify(client.getRecipe).bind(client);

server.get("/", async() => {
    const [ meta, recipe ] = await Promise.all([
        getMetaData({}),
        getRecipe({id:42}),
    ]);
    return {
        consumer_pid: process.pid,
        producer_data: meta,
        recipe
    };
});
server.listen(PORT, HOST, () => {
    console.log(`Consumer running at https://${HOST}:${PORT}`)
})
