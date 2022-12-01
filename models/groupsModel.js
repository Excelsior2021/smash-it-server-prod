const { Model } = require("objection");
const knex = require("knex")(require("../knexfile"));

Model.knex(knex);

class Groups extends Model {
  static get tableName() {
    return "groups_";
  }

  static get relationMappings() {
    const Users = require("./usersModel");
    const Stats = require("./statsModel");

    return {
      stats: {
        relation: Model.HasManyRelation,
        modelClass: Stats,
        join: {
          from: "groups_.id",
          to: "stats.groupId",
        },
      },

      users: {
        relation: Model.ManyToManyRelation,
        modelClass: Users,
        join: {
          from: "groups_.id",
          through: {
            modelClass: Stats,
            from: "stats.groupId",
            to: "stats.userId",
          },
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Groups;
