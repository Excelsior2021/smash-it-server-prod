const { Model } = require("objection");
const knex = require("knex")(require("../knexfile"));

Model.knex(knex);

class Users extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    const Groups = require("./groupsModel");
    const Stats = require("./statsModel");

    return {
      stats: {
        relation: Model.HasManyRelation,
        modelClass: Stats,
        join: {
          from: "users.id",
          to: "stats.userId",
        },
      },

      groups: {
        relation: Model.ManyToManyRelation,
        modelClass: Groups,
        join: {
          from: "users.id",
          through: {
            modelClass: Stats,
            from: "stats.groupId",
            to: "stats.userId",
          },
          to: "groups_.id",
        },
      },
    };
  }
}

module.exports = Users;
