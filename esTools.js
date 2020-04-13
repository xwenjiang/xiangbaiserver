const { Client } = require("@elastic/elasticsearch");
const esClient = new Client({ node: "http://localhost:9200" });
const add = (item) => {
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
module.exports = {
  add: add,
};
