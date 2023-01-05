//use this file to store code for generating database queries
const knex = require("../db/connection");

// CRUD
//create function creates knex query that inserts new reservation into reservations table while retunring all columns from newly inserted row
const create = (newReservation) => {
  return knex("reservations")
      .insert(newReservation)
      .returning("*")
      .then((createdReservations) => createdReservations[0]);
}

//select all columns from reservations table where reservation_id column matches arguments passed to the read() function. First() method return the first row in the tables an an object
const read = (reservation_id) => {
  return knex("reservations")
    .where({ reservation_id })
    .first();
}


const update = async (updatedReservation) => {
  // const { reservation_id } = updatedReservation;
  // await knex("reservations")
  //   .where({ reservation_id })
  //   .update(updatedReservation, "*");

  // return read(reservation_id);]

 
  return knex("reservations")
    .where({ reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then((records) => records[0])

  // return read(reservation_id);
}

const destroy = () => {
  return null;
}

const list = (reservation_date) => {
  if(reservation_date){
    return knex("reservations")
      .where({ reservation_date, status: "booked" })
      .orWhere({ reservation_date, status: "seated" })
      .orderBy("reservation_time");
  }
};


const search = (mobile_number) => {
  return knex("reservations")
    .select("*")
    .orderBy("reservation_date")
    .whereRaw(
      "translate(mobile_number, '() - ', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    );
};



module.exports = {
    create,
    read,
    update,
    destroy,
    list,
    search,
}