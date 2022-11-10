//use this file to store code for generating database queries
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

//create search function
function search(mobile_number){
    return knex("reservations")
        .where({ number: mobile_number })
}

// function listDate(){
 //   return knex(res)
 //   .where({ reservation_date })
//}

module.exports = {
    create,
    search,
    read,
    list, //list, listDate.
}