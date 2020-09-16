exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNull();
    table.string("user_name").notNull().unique();
    table.string("password", 60).notNull();
    table.boolean("deleted").notNull().default(false);
    table.timestamp("create_at").notNull().default(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};