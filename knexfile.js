require('dotenv').config();

module.exports = {
  client: 'mysql',
  connection: process.env.MYSQL_URL,
};
