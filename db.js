const knex = require('knex');
const config = require('./knexfile');

function getKnex() {
  return knex(config);
}

module.exports = {
  getKnex,
};
