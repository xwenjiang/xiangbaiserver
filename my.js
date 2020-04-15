const searchIndex = require("./test").searchIndex;
const getAllIndex = require("./test").getAllIndex;
const elastic = require("@elastic/elasticsearch");
const client = new elastic.Client({ node: "http://localhost:9200" });
// client.indices.getAlias().then((res) => {
//   let result = Object.getOwnPropertyNames(res.body);
//   console.log(result);
// });
console.log(getAllIndex());
