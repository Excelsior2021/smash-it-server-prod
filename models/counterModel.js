const { Model } = require("objection");
const knex = require("knex")(require("../knexfile"));

Model.knex(knex);

class Counter extends Model {
  static get tableName() {
    return "counter";
  }
}

module.exports = Counter;
