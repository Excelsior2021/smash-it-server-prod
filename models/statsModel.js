const { Model } = require("objection");
const knex = require("knex")(require("../knexfile"));

Model.knex(knex);

class Stats extends Model {
  static get tableName() {
    return "stats";
  }

  static get relationMappings() {
    const Users = require("./usersModel");
    const Groups = require("./groupsModel");

    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: Users,
        join: { from: "stats.userId", to: "users.id" },
      },

      group: {
        relation: Model.HasOneRelation,
        modelClass: Groups,
        join: { from: "stats.groupId", to: "groups_.id" },
      },
    };
  }
}

module.exports = Stats;
