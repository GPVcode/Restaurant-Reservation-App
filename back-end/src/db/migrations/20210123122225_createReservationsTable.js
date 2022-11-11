/** called whenever a migration is run */
// exports.up = function (knex) {
//   return knex.schema.createTable("reservations", (table) => {
//       table.increments("reservation_id").primary().notNullable();
//       table.string("first_name").notNullable();
//       table.string("last_name").notNullable();
//       table.string("mobile_number").notNullable();
//       table.date("reservation_date").notNullable();
//       table.time("reservation_time").notNullable();
//       table.integer("people").notNullable();
//       table.string("status");
//       table.timestamps(true, true);
//     });
//   };
exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.string("first_name").notNullable();
    table.string("last_name", null).notNullable();
    table.string("mobile_number", null).notNullable();
    table.date("reservation_date").notNullable();
    table.time("reservation_time").notNullable();
    table.integer("people", null).unsigned().notNullable();
    table.timestamps(true, true);
  });
};
  /** called whenever a migration is rolled back */
  exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
  };