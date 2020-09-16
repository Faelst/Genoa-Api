exports.up = function (knex) {
  return knex.schema.createTable("contracts", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned()
    table.integer("client_id").unsigned()
    table.timestamp("beginning_date").notNull();
    table.timestamp("final_date").notNull();
    table.float("total_amount_contract", 20, 10).notNull();
    table.boolean("deleted").notNull().default(false);
    table.foreign("user_id").references("users.id");
    table.foreign("client_id").references("clients.id");
    table.timestamp("create_at").notNull().default(knex.fn.now());
    table.timestamp("deleted_at").default(null);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("contracts");
};
