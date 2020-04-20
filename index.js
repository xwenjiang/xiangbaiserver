var express = require("express");
var bodyParser = require("body-parser");

var esSearch = require("./esTools").esSearch;

var elastic = require("@elastic/elasticsearch");
var client = new elastic.Client({
  node: "http://localhost:9200",
});
var userCount = 0;

const addIndex = require("./test").addIndex;
const addAnswer = require("./test").addAnswer;
const searchIndex = require("./test").searchIndex;

var app = express();
var port = 4000;

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get("/api/searchindex", jsonParser, (req, res) => {
  let query = req.query.dianpu.replace(/\s+/g, "");
  client.indices
    .exists({
      index: query,
    })
    .then((e) => {
      console.log(e);

      if (e.statusCode == "404") res.send("不存在");
      else {
        res.send("店铺存在");
      }
    });
});
app.post("/adddianpu", jsonParser, (req, res) => {
  req.body.dianpu = req.body.dianpu.replace(/\s+/g, "");
  searchIndex(req.body.dianpu).then((result) => {
    if (result) {
      res.send("店铺已经存在");
      res.end();
    } else {
      addIndex(req.body.dianpu).then((e) => {
        console.log(e);

        if (e) {
          res.send("添加成功");
          res.end();
        } else {
          res.send("添加失败");
          res.end();
        }
      });
    }
  });
});
app.post("/api/addanswer", jsonParser, function (req, res) {
  console.log(req.body);

  let item = {
    dianpu: req.body.dianpu.replace(/\s+/g, ""),
    answer: req.body.answer.replace(/\s+/g, ""),
  };
  searchIndex(item.dianpu).then((e) => {
    if (e == false) {
      res.send("店铺不存在");
    } else {
      client
        .index({
          index: item.dianpu,
          body: {
            answer: item.answer,
          },
        })
        .then((result) => {
          if (result.body.result === "created") {
            res.send("添加成功");
          }
        });
    }
  });
});

app.get("/allanswer", jsonParser, (req, res) => {
  let query = req.query.dianpu.replace(/\s+/g, "");
  console.log(query);

  let answerList = [];
  client
    .search({
      index: query,
      body: {
        query: {
          match_all: {},
        },
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log("发生了错误");
    });
});

app.get("/", (req, res) => {
  res.send("test sucesss!!!");
  res.json(port);
  res.end();
});
app.get("/api/search", (req, res) => {
  userCount = userCount + 1;
  console.log(`新用户访问：${req.ip}查找次数：${userCount}`);

  let dianpu = req.query.dianpu;
  let querystr = req.query.querystr;
  console.log(req.query);

  console.log(`用户询问：店铺:${req.query.dianpu}`);
  console.log(`用户询问语句：${req.query.querystr}`);

  esSearch(dianpu, querystr).then((data) => {
    res.json(data);
  });
});
app.get("/delindex", (req, res) => {
  let indexStr = req.query.index.replace(/\s+/g, "");

  client.indices.exists({ index: indexStr }).then((e) => {
    console.log(e.body);

    if (e.body == false) {
      res.end("不存在");
    } else {
      client.indices.delete({ index: indexStr }).then((result) => {
        console.log(result);

        if (result.statusCode == 200) {
          res.end("删除成功");
        } else {
          res.end("删除失败");
        }
      });
    }
  });
});
app.listen(port, () => {
  console.log(`服务器已经启动......端口号：${port}`);
});
