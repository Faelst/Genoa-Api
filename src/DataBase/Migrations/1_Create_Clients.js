exports.up = function (knex) {
  return knex.schema.createTable("clients", (table) => {
    table.increments("id").primary();
    table.string("name").notNull();
    table.string("type_text_desc").notNull();
    table.string("type_text_id").notNull().unique();
    table.date("inauguration_date").notNull();
    table.boolean("deleted").notNull().default(false);
    table.timestamp("create_at").notNull().default(knex.fn.now());
    table.timestamp("deleted_at").default(null);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("clients");
};
