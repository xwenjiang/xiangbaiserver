const elastic = require("@elastic/elasticsearch");
const client = new elastic.Client({
  node: "http://localhost:9200",
});

async function searchIndex(indexname) {
  let result = false;
  await client.indices
    .exists({
      index: indexname,
    })
    .then((data) => {
      if (data.statusCode == "404") {
        result = false;
      }
      if (data.statusCode == "200") {
        result = true;
      }
    });
  return result;
}
async function addIndex(indexName) {
  let result = false;
  await client.indices
    .create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            keyword: {
              type: "keyword",
            },
            answer: {
              type: "text",
              analyzer: "ik_max_word",
              search_analyzer: "ik_max_word",
            },
          },
        },
      },
    })
    .then((res) => {
      result = true;
    });
  return result;
}

module.exports = {
  addIndex: addIndex,

  searchIndex: searchIndex,
};
