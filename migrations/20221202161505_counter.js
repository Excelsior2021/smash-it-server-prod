/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("counter", table => {
    table.increments("id").primary();
    table.integer("logins").notNullable().unsigned().defaultTo(0);
    table.integer("newAccounts").notNullable().unsigned().defaultTo(0);
    table.integer("newGroups").notNullable().unsigned().defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("counter");
};
