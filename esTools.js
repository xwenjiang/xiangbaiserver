const { Client } = require("@elastic/elasticsearch");
const esClient = new Client({ node: "http://localhost:9200" });
const createIndex = require("./test");
const esAdd = (item) => {
  return new Promise((resolve, reject) => {
    createIndex(item).then(() => {
      console.log("添加成功");

      resolve();
    });
  });
};
const esSearch = async (index, str) => {
  let result;
  //console.log("essearch, index: ", index, ", str: ", str);
  await esClient
    .search({
      index: index,
      from: 0,
      size: 5,

      body: {
        query: {
          match: {
            answer: {
              query: str,
            },
          },
        },
      },
    })
    .then((chunk) => {
      result = chunk.body.hits.hits;
    });
  return result;
};
module.exports = {
  esAdd: esAdd,
  esSearch: esSearch,
};
