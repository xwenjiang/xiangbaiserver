const elastic = require("@elastic/elasticsearch");
const client = new elastic.Client({
  node: "http://localhost:9200",
});
async function getAllIndex() {
  let list = [];
  await client.indices.getAlias().then((res) => {
    let result = Object.getOwnPropertyNames(res.body);

    list = result;
  });
  return list;
}
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
            answer: {
              type: "text",
              analyzer: "ik_max_word",
              search_analyzer: "ik_smart",
            },
          },
        },
      },
    })
    .then((res) => {
      console.log(res);

      result = true;
    });
  return result;
}
async function addAnswer(obj) {
  let result = false;

  await client
    .index({
      index: obj.dianpu,
      body: {
        answer: obj.answer,
      },
    })

    .then(() => {
      result = true;
    });
  return result;
}

module.exports = {
  addIndex: addIndex,
  addAnswer: addAnswer,
  searchIndex: searchIndex,
  getAllIndex: getAllIndex,
};
