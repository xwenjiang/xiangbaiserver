const knex = require("knex");
const config = require("./knexfile").development;

function getKnex() {
  return knex(config);
}

module.exports = {
  getKnex,
};
