exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNull();
    table.string("user_name").notNull().unique();
    table.string("password", 60).notNull();
    table.boolean("delected").notNull().default(true);
    table.timestamp("issue_date").notNull().default(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};