// const protobuf = require("protobufjs");

// protobuf.load("google/protobuf/any.proto", function (error, root) {
//   if (error) {
//     throw error;
//   }

//   global.Any = root.lookup("Any");

//   protobuf.load("Demo.proto", function (error, root) {
//     if (error) {
//       throw error;
//     }

//     let Demo = root.lookup("Demo");
//     let test = Demo.create({
//       demo: "Hello World",
//     });

//     console.log(test);

//     var any = Any.create({
//       type_url: "whatever",
//       value: test,
//       // value:       Demo.encode(test).finish() // Or as packed buffer
//     });

//     console.log("Instance", any);
//     console.log("Packed", Any.encode(any).finish());
//   });
// });
