const statsData = require("../seed_data/stats");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("stats").del();
  await knex("stats").insert(statsData);
};
