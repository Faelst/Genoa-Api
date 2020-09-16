exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNull();
    table.string("user_name").notNull().unique();
    table.string("password", 60).notNull();
    table.boolean("deleted").notNull().default(false);
    table.timestamp("create_at").notNull().default(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  }).then(() => {
    return knex("users").insert([
      { name: "Genoa Seguros", user_name: "Genoa_User",  password: "95f6aef82c3bed7904c8d4daff" }
    ]);
  }
  )
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};