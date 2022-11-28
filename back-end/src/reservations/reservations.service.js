//use this file to store code for generating database queries
const knex = require("../db/connection");

// function list(){
//   return knex(tableName)
//     .select("*")
//     .whereNotIn("status", ["finished", "cancelled"])
//     .orderBy("reservations.reservation_date");
// }

//create function list() that builds a query that selects all columns from reservations table
// function list(date){
//     // return knex("reservations").select("*");
//     return knex(tableName)
//         .where("reservation_date", date)
//         .whereNotIn("status", ["finished", "cancelled"])
//         .orderBy("reservation_time");
// }


// function list(reservation_date = new Date()){
//   return knex("reservations")
//     .select("*")
//     .where("reservation_date", reservation_date)
//     .whereNotIn("status", ["finished", "cancelled"])
//     .orderBy("reservations.reservation_time");
// }

//  function listDate(){
//     return knex(res)
//     .where({ reservation_date })
// }

function list(){
  return knex("reservations")
    .select("*")
    .whereNotIn("status", ["finished", "cancelled"])
    .orderBy("reservation_time");
}

function listByDate(reservation_date){
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .whereNotIn("status", ["finished", "cancelled"])
    .orderBy("reservation_time");
}

//create function creates knex query that inserts new reservation into reservations table while retunring all columns from newly inserted row
function create(newReservation){
    return knex("reservations")
        .insert({
          ...newReservation,
          "status": "booked",
        })
        .returning("*")
        .then((result) => result[0]);
}


//select all columns from reservations table where reservation_id column matches arguments passed to the read() function. First() method return the first row in the tables an an object
function read(reservation_id){
    return knex("reservations")
      .select("*")
      .where({ reservation_id })
      .then((result) => result[0]);
}

async function updateStatus(reservation_id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status: status }, "*")
}

async function updateReservation(reservation){
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = reservation;
  return knex('reservations')
    .where({ reservation_id })
    .update({
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people,
    }, [
      'first_name',
      'last_name',
      'mobile_number',
      'people',
      'reservation_date',
      'reservation_time',
    ])
}

function listByPhone(mobile_number){
  return knex("reservations")
    .whereRaw(
      "transalte(mobile_number, '() - ', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}


// function status(reservation) {
//     update(reservation);
//     return validStatus(reservation);
// }

// function validStatus(reservation) {
//   if (["booked", "seated", "finished", "cancelled"].includes(reservation.status)) {
//     return reservation;
//   }
//   const error = new Error(
//     `Invalid status:"${reservation.status}"`
//   );
//   error.status = 400;
//   throw error;
// }



module.exports = {
    list,
    listByDate,
    listByPhone,
    create,
    read,
    updateStatus,
    updateReservation
}