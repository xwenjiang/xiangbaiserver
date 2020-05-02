
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('username');
    table.string('password');
    table.string('role');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
