var express = require("express");
var bodyParser = require("body-parser");
var add = require("./esTools").add;
var app = express();
var port = 4000;
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// POST /login gets urlencoded bodies

// POST /api/users gets JSON bodies
app.post("/api/add", jsonParser, function (req, res) {
  // create user in req.body
  // console.log(`得到前端数据：${req.query}`); //res.body的内容是{xiangbai:string,guanjianzi:string,conteng:[string]}
  console.log(req.body);
  add(req.body).then((result) => {
    // console.log("插入一个数据成功,es返回数据", result);
  });
  //请求es此处进行分词
  //得到es已分词的关键字数组
  //循环数组查询数组中的每一个关键字在数据库里是否有记录，
  //如果有将匹配文档的cotent字段加入到结果数组，
  //返回给客户端结果数组
  res.send("ok");
});

app.listen(port, () => console.log("server started"));
