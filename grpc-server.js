const PROTO_PATH = __dirname + "/protobuf/catalog.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const buildTree = require("./service/buildTree");
const protobuf = require("protobufjs");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// console.log(packageDefinition);

const root = await protobuf.load(PROTO_PATH);
const catalog = await root.lookupType("catalog.HelloReply");

const catalog_proto = grpc.loadPackageDefinition(packageDefinition).catalog;

async function sayHello(call, callback) {
  try {
    const result = await buildTree();
    const verify = await catalog.encode(result).finish();
    console.log(verify);
    callback(null, { tree: verify });
  } catch (error) {
    console.log(error);
  }
}

function main() {
  let server = new grpc.Server();
  server.addService(catalog_proto.Greeter.service, { sayHello: sayHello });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

main();
