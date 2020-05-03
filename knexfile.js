require("dotenv").config();

module.exports = {
  client: "mysql",
  // connection: process.env.MYSQL_URL,
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "12345678",
    database: "xiangbai",
  },
};
