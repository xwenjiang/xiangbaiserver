require("dotenv").config();

var express = require("express");
var bodyParser = require("body-parser");
const session = require("express-session");
const SessionStore = require("express-mysql-session");
const passport = require("passport");
const mysql = require("mysql");
var path = require("path");
require("./passport");

var esSearch = require("./esTools").esSearch;

var elastic = require("@elastic/elasticsearch");
var client = new elastic.Client({
  node: "http://localhost:9200",
});
var userCount = 0;

const addIndex = require("./test").addIndex;
const addAnswer = require("./test").addAnswer;
const searchIndex = require("./test").searchIndex;
const getallindex = require("./getallIndex").getallIndex;
const delIndex = require("./getallIndex").delIndex;
var app = express();
var port = 4000;
var mysqlOption = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "xiangbai",
  port: 3306,
  useConnectionPooling: true,
};

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Setup session
const MySQLStore = SessionStore(session);
const sessionStore = new MySQLStore({}, mysql.createConnection(mysqlOption));
app.use(express.static("build"));
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.use(
  session({
    name: "xiangbai",
    secret: "xiangbai-server",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: true,
    },
    store: sessionStore,
  })
);

app.post("/login", (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "local-user",
      { session: false },
      (err, user, info) => {
        if (err) {
          return reject(err);
        }
        if (!user) {
          const error = new Error(info.message);
          error.status = 401;
          return reject(error);
        }
        return req.login(user, (loginErr) => {
          if (loginErr) {
            return resolve(loginErr);
          }
         

          return resolve(user);
        });
      }
    )(req);
  })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

app.get("/api/indexlist", (req, res) => {
  getallindex().then((result) => {
    res.json(result);
  });
});
app.post("/api/delindex", (req, res) => {
  let name = req.query.name;
  delIndex(name).then((e) => {
    res.json(e.body);
  });
});
app.get("/api/splite", (req, res) => {
  let query = req.query;
  client.indices
    .analyze({
      index: query.dianpu,
      body: {
        analyzer: "ik_max_word",
        text: req.query.text,
      },
    })
    .then((e) => {
      res.json(e);
    });
});
app.get("/api/searchindex", jsonParser, (req, res) => {
  let query = req.query.dianpu.replace(/\s+/g, "");
  client.indices
    .exists({
      index: query,
    })
    .then((e) => {


      if (e.statusCode == "404") res.send("不存在");
      else {
        res.send("店铺存在");
      }
    });
});
app.post("/api/delanswer", jsonParser, (req, res) => {
  let id = req.body.id;
  let dianpu = req.body.dianpu;

  client
    .delete({
      id: id,
      index: dianpu,
    })
    .then((e) => {
      res.json(e);
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


  let answerList = [];
  client
    .search({
      index: query,
      body: {
        size: 500,
        query: {
          match_all: {},
        },
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      
    });
});

app.get("/api/search", (req, res) => {
  userCount = userCount + 1;
  

  let dianpu = req.query.dianpu;
  let querystr = req.query.querystr;


  console.log(`用户询问：店铺:${req.query.dianpu}`);
  console.log(`用户询问语句：${req.query.querystr}`);

  esSearch(dianpu, querystr).then((data) => {
    res.json(data);
  });
});
app.get("/delindex", (req, res) => {
  let indexStr = req.query.index.replace(/\s+/g, "");

  client.indices.exists({ index: indexStr }).then((e) => {
    

    if (e.body == false) {
      res.end("不存在");
    } else {
      client.indices.delete({ index: indexStr }).then((result) => {
   

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
