// Update with your config settings.

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "root",
      password: "12345678",
      database: "xiangbai",
    },
  },

  staging: {
    client: "mysql",
    connection: {
      database: "xiangbai",
      user: "root",
      password: "12345678",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "mysql",
    connection: {
      database: "xiangbai",
      user: "root",
      password: "12345678",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
