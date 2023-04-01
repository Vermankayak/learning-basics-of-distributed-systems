const grpc = require("@grpc/grpc-js");
const loader = require("@grpc/proto-loader");
const path = require("path");

const pkg_def = loader.loadSync(path.join(__dirname, "../shared/grpc-recipe.proto"));
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

const server = new grpc.Server();

function getMetaData(_call, cb) {
    return cb(null, {
        pid:process.pid
    })
};
function getRecipe(call, cb){
    if(call.request.id !== 42) {
        return cb(new Error(`Unkown recipe ${call.request.id}`))
    }
    return cb(null, {
        id: 42,
        name: "Chicken Tikka Masala",
        steps: "Throw it in a pot...",
        ingredients: [
            {id: 1, name: "Chiken", quantity: "1 lb"},
            {id: 2, name: "Sauce", quantity: "2 cups"}
        ]
    })
}

server.addService(recipe.RecipeService.service, { getRecipe, getMetaData });

server.bindAsync(
    `${HOST}:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if(err) throw err;
        server.start();
        console.log(`Producer running at http://${HOST}:${PORT}/`)
    }
)
