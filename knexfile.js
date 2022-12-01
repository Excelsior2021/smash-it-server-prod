// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const development = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "rootroot",
    database: "smashit",
    charset: "utf8",
  },
};

const production = {
  client: "mysql",
  connection:
    "mysql://root:q8vJtW8Oa8i7CSvjlRlV@containers-us-west-99.railway.app:5638/railway",
};

module.exports = production;
