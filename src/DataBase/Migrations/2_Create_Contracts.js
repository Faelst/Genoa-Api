exports.up = function (knex) {
  return knex.schema.createTable("contracts", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned()
    table.integer("client_id").unsigned()
    table.timestamp("beginning_date").notNull().unique();
    table.timestamp("final_date").notNull().unique();
    table.float("total_amount_contract").notNull().unique();
    table.boolean("delected").notNull().default(false);
    table.timestamp("issue_date").notNull().default(knex.fn.now());
    table.foreign("user_id").references("users.id");
    table.foreign("client_id").references("clients.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("contracts");
};
