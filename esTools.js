const { Client } = require("@elastic/elasticsearch");
const esClient = new Client({ node: "http://localhost:9200" });
const esAdd = (item) => {
  return new Promise((resolve, reject) => {
    esClient
      .index({
        index: item.dianpu,
        body: item,
      })
      .then((result) => {
        resolve(result);
      });
  });
};
const esSearch = async (index, str) => {
  let result;
  console.log("essearch, index: ", index, ", str: ", str);
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
