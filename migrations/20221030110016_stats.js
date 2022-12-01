/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("stats", table => {
    table.increments("id").primary();
    table.string("username").notNullable();
    table
      .integer("userId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("groupName").notNullable();
    table
      .integer("groupId")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("groups_")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.integer("wins").notNullable().unsigned().defaultTo(0);
    table.integer("loses").notNullable().unsigned().defaultTo(0);
    table.integer("matches").notNullable().unsigned().defaultTo(0);
    table.integer("pts for").notNullable().unsigned().defaultTo(0);
    table.integer("pts against").notNullable().unsigned().defaultTo(0);
    table.integer("whitewashes").notNullable().unsigned().defaultTo(0);
    table.integer("whitewashed").notNullable().unsigned().defaultTo(0);
    table.integer("tournaments").notNullable().unsigned().defaultTo(0);
    table.integer("tournaments won").notNullable().unsigned().defaultTo(0);
    table.integer("leagues").notNullable().unsigned().defaultTo(0);
    table.integer("leagues won").notNullable().unsigned().defaultTo(0);
    table.integer("score").notNullable().unsigned().defaultTo(0);
    table.boolean("admin").notNullable().defaultTo(false);
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("stats");
};
