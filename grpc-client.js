const PROTO_PATH = __dirname + "/protobuf/catalog.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const catalog_proto = grpc.loadPackageDefinition(packageDefinition).catalog;

function main() {
  let client = new catalog_proto.Greeter(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  client.sayHello({ name: "abc" }, (err, response) => {
    console.log(response.tree);
  });
}
main();
