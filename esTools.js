const { Client } = require("@elastic/elasticsearch");
const esClient = new Client({ node: "http://localhost:9200" });

const esSearch = async (index, str) => {
  let result;

  await esClient
    .search({
      index: index,
      from: 0,
      size: 500,

      body: {
        query: {
          match: {
            answer: {
              query: str,
              analyzer: "ik_max_word",
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
  esSearch: esSearch,
};
