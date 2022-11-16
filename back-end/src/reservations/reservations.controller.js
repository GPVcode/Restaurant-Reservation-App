/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasOnlyValidProperties(req, res, next){
  const { data = {} } = req.body;
  const VALID_PROPERTIES = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "reservation_id"
  ]);
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.has(field)
  );
  
  if(invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}

function hasReservationId(req, res, next){
  const reservation =  req.params.reservation_id || req.body?.data?.reservation_id;
  if(reservation){
    res.locals.reservation = reservation;
    next();
  } else {
    next({ status: 400, message: `missing reservation_id`, });
  }
}

async function reservationExists(req, res, next){
  const reservation_id = res.locals.reservation_id
  const reservation = await reservationsService.read(reservation_id);
  // const reservation = await reservationsService.read(req.params.reservationId);

  if(reservation){
    res.locals.reservation = reservation;
    next();
    // return next();
  } else{
    next({ status: 404, message: `Reservation cannot be found: ${reservation_id}`});
  }
  // next({ status: 404, message: `Reservation cannot be found.`});
} 

// const hasRequiredProperties = hasProperties("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people");
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

function isValidDate(req, res, next){
  const { data = {} } = req.body;
  const reservation_date = new Date(data['reservation_date']);
  const day = reservation_date.getUTCDay();

  if (isNaN(Date.parse(data['reservation_date']))){
      return next({ status: 400, message: `Invalid reservation_date` });
  }
  if (day === 2) {
      return next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }
  if (reservation_date < new Date()) {
      return next({ status: 400, message: `Reservation must be set in the future` });
  }
  next();
}

function isTime(req, res, next){
  const { data = {} } = req.body;
  // TODO: Change this...
  if (/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(data['reservation_time']) || /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(data['reservation_time']) ){
    return next();
  }
  next({ status: 400, message: `Invalid reservation_time` });
}

function checkStatus(req, res, next){
  const { data = {} } = req.body;
  if (data['status'] === 'seated' || data['status'] === 'finished'){
      return next({ status: 400, message: `status is ${data['status']}` });
  }
  next();
}

function isValidNumber(req, res, next){
  const { data = {} } = req.body;
  if (data['people'] === 0 || !Number.isInteger(data['people'])){
      return next({ status: 400, message: `Invalid number of people` });
  }
  next();
}

async function list(req, res) {
  // const mobile_number = req.query.mobile_number;
  // const data = await (
  //     mobile_number
  //   ? reservationsService.search(mobile_number)
  //   : reservationsService.list(req.query.date)
  // );

  const data = await reservationsService.list(req.query.date)
  res.json({ data });
}

//create function calls the reservationsService.create method and passes in req.body.data which refers to the object containing reservation info. If promise is resolved successfully, the server responds with a 201 status code with newly created reservation. 
async function create(req, res){
  const reservation = await reservationsService.create(req.body.data);
  res.status(201).json({ data: reservation });
}

async function read(req, res) {
  const data =  res.locals.reservation;
  // const { reservation: data } = res.locals;
  res.status(200).json({ data });
}

async function status(req, res) {
  res.locals.reservation.status = req.body.data.status;
  const data = await service.status(res.locals.reservation);
  res.json({ data });
}

async function unfinishedStatus(req, res, next){
  if ("booked" !== res.locals.reservation.status) {
    next({
      status: 400,
      message: `Reservation status: '${res.locals.reservation.status}'.`,
    });
  } else {
      next();
  }
}

async function destroy(req, res){
  await reservationsService.delete(res.locals.reservation.reservation_id);
  res.sendStatus(204);
}

const has_first_name = bodyDataHas("first_name");
const has_last_name = bodyDataHas("last_name");
const has_mobile_number = bodyDataHas("mobile_number");
const has_reservation_date = bodyDataHas("reservation_date");
const has_reservation_time = bodyDataHas("reservation_time");
const has_people = bodyDataHas("people");
const has_capacity = bodyDataHas("capacity");
const has_table_name = bodyDataHas("table_name");
const has_reservation_id = bodyDataHas("reservation_id");

module.exports = {
  create: [
    // hasRequiredProperties,
    hasOnlyValidProperties, 
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    has_people, 
    isValidDate,
    isTime,
    isValidNumber,
    checkStatus,
    asyncErrorBoundary(create)
  ],
  read: [hasReservationId, reservationExists, read],
  delete: [reservationExists, destroy],
  list: [asyncErrorBoundary(list)],
  reservationExists: [hasReservationId, reservationExists],
  status: [hasReservationId, reservationExists, unfinishedStatus, asyncErrorBoundary(status)],
}
