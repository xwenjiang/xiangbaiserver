var express = require("express");
var bodyParser = require("body-parser");
var esAdd = require("./esTools").esAdd;
var esSearch = require("./esTools").esSearch;
var esAdd = require("./esTools").esAdd;

var userCount = 0;
var addUserCount = 0;
const os = require("os");
const result = os.networkInterfaces().en0[1].address;
const addIndex = require("./test").addIndex;
const addAnswer = require("./test").addAnswer;
const searchIndex = require("./test").searchIndex;
const getallindex = require("./test").getallindex;
//console.log(result.en0[1].address);

var app = express();
var port = 4000;
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// POST /login gets urlencoded bodies

// POST /api/users gets JSON bodies
app.get("/getallindex", (req, res) => {
  res.json(getallindex());
});
app.post("/adddianpu", jsonParser, (req, res) => {
  searchIndex(req.body.dianpu).then((result) => {
    if (result) {
      res.end("店铺已经存在");
    } else {
      addIndex(req.body.dianpu).then((e) => {
        console.log(e);

        if (e) {
          res.send("添加成功");
        } else {
          res.send("添加失败");
        }
      });
    }
  });
});
app.post("/api/add", jsonParser, function (req, res) {
  let item = req.body;
  addAnswer(item).then((result) => {
    if (result) {
      res.send("添加成功");
    } else {
      res.send("添加失败");
    }
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
    //console.log(data);
    res.json(data);
  });
});
app.listen(port, () => {
  console.log(`服务器已经启动...Ip地址：${result}...端口号：${port}`);
});
