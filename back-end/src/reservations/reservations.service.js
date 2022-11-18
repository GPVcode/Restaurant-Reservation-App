//use this file to store code for generating database queries
const knex = require("../db/connection");
const tableName = "reservations"

function list(){
  return knex(tableName)
    .whereNotIn("status", ["finished", "cancelled"])
    .orderBy("reservation_time");
}
//create function list() that builds a query that selects all columns from reservations table
// function list(date){
//     // return knex("reservations").select("*");
//     return knex(tableName)
//         .where("reservation_date", date)
//         .whereNotIn("status", ["finished", "cancelled"])
//         .orderBy("reservation_time");
// }

//create function creates knex query that inserts new reservation into reservations table while retunring all columns from newly inserted row
function create(reservation){
    // return knex("reservations")
    return knex(tableName)
        .insert(reservation)
        .returning("*")
        .then((createdReservations) => createdReservations[0]);
}

//select all columns from reservations table where reservation_id column matches arguments passed to the read() function. First() method return the first row in the tables an an object
function read(reservation_id){
    return knex(tableName)
      .where("reservation_id", reservation_id)
      .first();
    // return knex("reservations")
    //     .select("*")
    //     .where({ reservation_id: reservationId })
    //     .first();
}

function destroy(reservation_id){
    return knex("reservations")
        .where({ reservation_id })
        .del();
}
// function listDate(){
 //   return knex(res)
 //   .where({ reservation_date })
//}

function update(reservation) {
    return knex(tableName)
      .where({ reservation_id: reservation.reservation_id })
      .update(reservation, "*")
      .then((records) => records[0]);
}

function status(reservation) {
    update(reservation);
    return validStatus(reservation);
}

function validStatus(reservation) {
  if (["booked", "seated", "finished", "cancelled"].includes(reservation.status)) {
    return reservation;
  }
  const error = new Error(
    `Invalid status:"${reservation.status}"`
  );
  error.status = 400;
  throw error;
}

//create search function
function search(mobile_number) {
  return knex(tableName)
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}
// function search(phoneNumber){
//     return knex("reservations")
//         .where({ mobile_number: phoneNumber })
// }

module.exports = {
    create,
    list, //list, listDate.
    read,
    search,
    status,
    delete: destroy,
}