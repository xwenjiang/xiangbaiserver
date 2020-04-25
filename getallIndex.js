var elastic = require("@elastic/elasticsearch");
var client = new elastic.Client({ node: "http://localhost:9200" });
async function getindexs() {
  let list = [];
  await client.cat.indices({ format: "json" }).then((res) => {
    res.body.forEach((element) => {
      list.push(element.index);
    });
  });
  return list.filter((e) => e.indexOf(".") != 0);
}
async function delIndex(name) {
  let result = false;
  await client.indices
    .delete({
      index: name,
    })
    .then((res) => {
      result = res;
    });
  return result;
}
module.exports = {
  getallIndex: getindexs,
  delIndex: delIndex,
};
