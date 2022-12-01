const groupsData = require("../seed_data/groups");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("groups_").del();
  await knex("groups_").insert(groupsData);
};
