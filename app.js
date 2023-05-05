const express = require("express");
const buildTree = require("./service/buildTree");
const app = express();
const PROTO_PATH = __dirname + "/protobuf/catalog.proto";
const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");
const protobuf = require("protobufjs");

app.get("/", async (req, res) => {
  // const packageDefinition = await protoLoader.loadSync(PROTO_PATH, {
  //   keepCase: true,
  //   longs: String,
  //   enums: String,
  //   defaults: true,
  //   oneofs: true,
  // });
  const root = await protobuf.load(PROTO_PATH);
  const catalog = await root.lookupType("catalog.HelloReply");
  // const catalog_proto = await grpc.loadPackageDefinition(packageDefinition)
  //   .catalog;

  // let client = new catalog_proto.Greeter(
  //   "localhost:50051",
  //   grpc.credentials.createInsecure()
  // );
  // await client.sayHello({ name: "abc" }, async (err, response) => {
  //   const result = response.tree;
  //   res.json(result);
  // });
  const Client = grpc.makeGenericClientConstructor({});
  const client = new Client(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
});

app.get("/tree", async (req, res) => {
  const result = await buildTree();
  res.json(result);
});

app.get("/test", async (req, res) => {
  const protobuf = require("protobufjs");

  protobuf.load("./protobuf/catalog.proto", (err, root) => {
    if (err) throw err;
    global.HelloReply = root.lookupType("catalog.HelloReply");

    var payload = {
      tree: [
        {
          id: 2,
          name: "Lớp 2",
          parent_id: 0,
          code: 2,
          depth: 0,
          children: [
            {
              id: 13,
              name: "Toán",
              parent_id: 2,
              code: 1,
              depth: 1,
              children: [
                {
                  id: 14,
                  name: "Ôn tập và bổ sung",
                  parent_id: 13,
                  code: 1,
                  depth: 2,
                  children: [
                    {
                      id: 15,
                      name: "Ôn tập các số đến 100",
                      parent_id: 14,
                      code: 1,
                      depth: 3,
                      children: [
                        {
                          id: 16,
                          name: "Hoàn thành bảng ",
                          parent_id: 15,
                          code: 1,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 17,
                          name: "Nối - tương ứng",
                          parent_id: 15,
                          code: 2,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 18,
                          name: "Đọc, viết số",
                          parent_id: 15,
                          code: 3,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 19,
                          name: "Tìm số",
                          parent_id: 15,
                          code: 4,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 20,
                          name: "Sắp xếp số theo thứ tự tăng dần",
                          parent_id: 15,
                          code: 5,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 21,
                          name: "Sắp xếp số theo thứ tự giảm dần",
                          parent_id: 15,
                          code: 6,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 22,
                          name: "Đúng - Sai",
                          parent_id: 15,
                          code: 7,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 23,
                          name: "Thành lập các số có hai chữ số",
                          parent_id: 15,
                          code: 8,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 24,
                          name: "Ước lượng trong phạm vi 100 ",
                          parent_id: 15,
                          code: 9,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 25,
                          name: "Tìm số lớn nhất ",
                          parent_id: 15,
                          code: 10,
                          depth: 4,
                          children: [],
                        },
                        {
                          id: 26,
                          name: "Tìm số bé nhất ",
                          parent_id: 15,
                          code: 11,
                          depth: 4,
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    var errMsg = HelloReply.verify(payload);
    // res.json(errMsg);
    if (errMsg) throw Error(errMsg);
    console.log("errMsg: ", errMsg);

    // Create a new message
    var message = HelloReply.create(payload); // or use .fromObject if conversion is necessary
    console.log("message: ", message);

    // Encode a message to an Uint8Array (browser) or Buffer (node)
    var buffer = HelloReply.encode(message).finish();
    // ... do something with buffer
    console.log("buffer: ", buffer);
    // Decode an Uint8Array (browser) or Buffer (node) to a message
    var decodeBuffer = HelloReply.decode(buffer);
    console.log("decode buffer: ", decodeBuffer);
    res.json(decodeBuffer);
    // ... do something with message

    // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.

    // Maybe convert the message back to a plain object
    var object = HelloReply.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
      // see ConversionOptions
    });
    console.log("object: ", object);
  });
});

app.listen(8080);
