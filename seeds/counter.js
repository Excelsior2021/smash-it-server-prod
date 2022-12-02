const counterData = require("../seed_data/counter");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("counter").del();
  await knex("counter").insert(counterData);
};
