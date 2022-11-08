exports.seed = function (knex) {
  return knex
  .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
  .then(function () {
  /** inserts all seed entries into the tables table */
    return knex("tables").insert([
    { table_name: "#1", capacity: 2, status: "free" },
    { table_name: "#2", capacity: 4, status: "free" },
    { table_name: "Pool #1", capacity: 2, status: "free" },
    { table_name: "Roof #2", capacity: 2, status: "free" },
    ]);
  });
};