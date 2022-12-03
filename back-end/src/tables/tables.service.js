const knex = require('../db/connection');

const readAll = (table_id) => {
    return knex('tables as t')
    .join('reservations as r', 't.reservation_id', 'r.reservation_id')
    .where({table_id})
} 

//CRUDL
const create = (newTable) => {
    return knex('tables')
    .insert(newTable, '*')
    .then((createdTables) => createdTables[0]);
};

const read = (table_id) => {
    return knex('tables')
    .select('*')
    .where({table_id})
    .first();
};

//issue #11
const readRes = (reservation_id) => {
    return knex('reservations')
    .where({reservation_id})
    .first();
};

//issue #11
const readByCapacity = (capacity, table_id) => {
    return knex('tables')
    .where({capacity})
    .where({table_id});
};

const update = async (updatedTable, updatedReservation) => {
    const {table_id, reservation_id} = updatedTable;
    await knex('tables')
    .where({table_id})
    .update(updatedTable, '*');

    await knex('reservations')
    .where({reservation_id})
    .update(updatedReservation, '*')

    return read(table_id)
};

//issue #7
const destroy = async (openedTable, finishedReservation) => {
    const {table_id} = openedTable;
    const {reservation_id} = finishedReservation;
    await knex('tables')
    .where({table_id})
    .update(openedTable, '*');

    await knex('reservations')
    .where({reservation_id})
    .update(finishedReservation, '*');

    return readAll(table_id);
};

//issue #9
const list = () => {
    return knex('tables')
    .select('*')
    .orderBy('table_name');
};

module.exports = {
    create,
    read,
    readRes,
    readByCapacity,
    update,
    destroy,
    list,
};