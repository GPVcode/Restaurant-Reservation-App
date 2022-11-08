//use this file to store code for generating database queries

const { destroy } = require("../db/connection");
const knex = require("../db/connection");

//create function list() that builds a query that selects all columns from reservations table
function list(){
    return knex("reservations").select("*");
}

//select all columns from reservations table where reservation_id column matches arguments passed to the read() function. First() method return the first row in the tables an an object
function read(reservationId){
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .first();
}

//create function creates knex query that inserts new reservation into reservations table while retunring all columns from newly inserted row
function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdReservations) => createdReservations[0]);
}



module.exports = {
    create,
   // search,
    read,
    list,//: list, listDate,
    //delete: destroy,
}