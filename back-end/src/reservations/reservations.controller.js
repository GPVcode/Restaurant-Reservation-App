/**
 * List handler for reservation resources
 */
const P = require("pino");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");


// const VALID_RESERVATION_FIELDS = [
//   "first_name",
//   "last_name",
//   "mobile_number",
//   "reservation_date",
//   "reservation_time",
//   "people",
// ];

// //helper function for validation
// function _validateTime(str) {
//   const [hour, minute] = str.split(":");

//   if (hour.length > 2 || minute.length > 2) {
//     return false;
//   }
//   if (hour < 1 || hour > 23) {
//     return false;
//   }
//   if (minute < 0 || minute > 59) {
//     return false;
//   }
//   return true;
// }

// //validation middleware
// function isValidReservation(req, res, next) {
//   const reservation = req.body.data;

//   if (!reservation) {
//     return next({ status: 400, message: `Must have data property.` });
//   }

//   VALID_RESERVATION_FIELDS.forEach((field) => {
//     if (!reservation[field]) {
//       return next({ status: 400, message: `${field} field required` });
//     }

//     if (field === "people" && typeof reservation[field] !== "number") {
//       return next({
//         status: 400,
//         message: `${reservation[field]} is not a number type for people field.`,
//       });
//     }

//     if (field === "reservation_date" && !Date.parse(reservation[field])) {
//       return next({ status: 400, message: `${field} is not a valid date.` });
//     }

//     if (field === "reservation_time") {
//       if (!_validateTime(reservation[field])) {
//         return next({ status: 400, message: `${field} is not a valid time` });
//       }
//     }
//   });

//   next();
// }

// function isNotOnTuesday(req, res, next) {
//   const { reservation_date } = req.body.data;
//   const [year, month, day] = reservation_date.split("-");
//   const date = new Date(`${month} ${day}, ${year}`);
//   res.locals.date = date;
//   if (date.getDay() === 2) {
//     return next({ status: 400, message: "Location is closed on Tuesdays" });
//   }
//   next();
// }

// function isInTheFuture(req, res, next) {
//   const date = res.locals.date;
//   const today = new Date();
//   if (date < today) {
//     return next({ status: 400, message: "Must be a future date" });
//   }
//   next();
// }

// function isWithinOpenHours(req, res, next) {
//   const reservation = req.body.data;
//   const [hour, minute] = reservation.reservation_time.split(":");
//   if (hour < 10 || hour > 21) {
//     return next({
//       status: 400,
//       message: "Reservation must be made within business hours",
//     });
//   }
//   if ((hour < 11 && minute < 30) || (hour > 20 && minute > 30)) {
//     return next({
//       status: 400,
//       message: "Reservation must be made within business hours",
//     });
//   }
//   next();
// }

// function hasBookedStatus(req, res, next) {
//   const { status } = res.locals.reservation
//     ? res.locals.reservation
//     : req.body.data;
//   if (status === "seated" || status === "finished" || status === "cancelled") {
//     return next({
//       status: 400,
//       message: `New reservation can not have ${status} status.`,
//     });
//   }
//   next();
// }

// function isValidStatus(req, res, next) {
//   const VALID_STATUSES = ["booked", "seated", "finished", "cancelled"];
//   const { status } = req.body.data;
//   if (!VALID_STATUSES.includes(status)) {
//     return next({ status: 400, message: "Status unknown." });
//   }
//   next();
// }

// function isAlreadyFinished(req, res, next) {
//   const { status } = res.locals.reservation;
//   if (status === "finished") {
//     return next({
//       status: 400,
//       message: "Cannot change a reservation with a finished status.",
//     });
//   }
//   next();
// }

// const reservationExists = async (req, res, next) => {
//   const { reservation_id } = req.params;
//   const reservation = await service.read(reservation_id);

//   if (reservation) {
//     res.locals.reservation = reservation;
//     return next();
//   }
//   next({
//     status: 404,
//     message: `Reservation_id ${reservation_id} does not exist.`,
//   });
// };
//   ///////////////////////////////////////
// //   




//validation middleware
async function reservationExists(req, res, next){
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if(reservation){
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservationId} not found`,
  })
}

function hasData(req, res, next){
  if(req.body.data){
    return next();
  }
  next({
    status: 400,
    message: "Body must have data property."
  })
}

function hasFirstName(req, res, next){
  const name = req.body.data.first_name;
  if(name){
    return next();
  }
  next({
    status: 400,
    message: "first_name property required.",
  })
}

function hasLastName(req, res, next){
  const name = req.body.data.last_name;
  if (name){
    return next();
  }
  next({
    status: 400,
    message: "last_name property required.",
  })
}

function validStatus(req, res, next){
  const status = req.body.data.status;
  if(status !== 'seated' && status !== 'finished'){
    return next();
  }
  next({
    status: 400,
    message: "status cannot be seated, finished"
  })
}

function hasMobileNumber(req, res, next){
  const phone = req.body.data.mobile_number;
  if(phone){
    return next();
  }
  next({
    status: 400,
    message: "mobile_number property required.",
  })
}

function hasReservationDate(req, res, next){
  const date = req.body.data.reservation_date;
  if(date){
    return next();
  }
  next({
    status: 400,
    message: "reservation_date property required.",
  })
}

function validDate(req, res, next){
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);

  if(valid){
    return next();
  }
  next({
    status: 400,
    message: "reservation_date must be valid date.",
  })
}

function noTuesday(req, res, next){
  const date = req.body.data.reservation_date;
  const weekday = new Date(date).getUTCDay();
  if(weekday !== 2){
    return next();
  }
  next({
    status: 400,
    message: "Restaurant is closed on Tuesdays.",
  })
}

function noPastReservations(req, res, next){
  const { reservation_date, reservation_time } = req.body.data;
  const now = Date.now();
  const proposedReservation = new Date(`${reservation_date} ${reservation_time}`).valueOf();

  if(proposedReservation > now){
    return next();
  }
  next({
    status: 400,
    message: "Reservation must be in future.",
  })
}

function hasReservationTime(req, res, next){
  const time = req.body.data.reservation_time;
  if(time && typeof time === 'string'){
    return next();
  }
  next({
    status: 400,
    message: "valid reservation_time property required."
  })
}

function validTime(req, res, next){
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  const time = req.body.data.reservation_time;
  const valid = time.match(regex);
  if(valid){
    return next();
  }
  next({
    status: 400,
    message: "reservation_time must be valid time.",
  })
}

function reservationDuringHours(req, res, next){
  const time = req.body.data.reservation_time;
  const open = "10:30";
  const close = "21:30";
  if(time >= open && time <= close){
    return next();
  }
  next({
    status: 400,
    message: "Reservation must be between 10:30AM and 9:30PM."
  })
}

function hasValidPeople(req, res, next){
  const people = req.body.data.people;

  if(people > 0 && typeof people === 'number'){
    return next();
  }
  next({
    status: 400,
    message: "valid people property required"
  })
}

function updateValidStatus(req, res, next){
  const status = req.body.data.status;
  if(status !== 'unknown'){
    return next();
  }
  next({
    status: 400,
    message: "status cannot be unknown."
  })
}

function notFinished(req, res, next){
  const reservation = res.locals.reservation;
  if(reservation.status === "finished"){
    next({
      status: 400,
      message: "reservation cannot already be finished.",
    })
  } else {
    return next();
  }
}

//Crud list handlers for reservation resources

async function list(req, res) {
  const { date, currentDate, mobile_number } = req.query;
  if(date){
    const data = await service.listByDate(date);
    res.json({ data });
  } else if(currentDate){
    const data = await service.listByDate(currentDate);
    res.json({ data });
  } else if (mobile_number){
    const data = await service.listByPhone(mobile_number);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

async function read(req, res) {
  const data =  res.locals.reservation;
  res.status(200).json({ data });
}
async function create(req, res){
  const reservation = await reservationsService.create(req.body.data);
  res.status(201).json({ data: reservation });
}

async function updateReservation(req, res) {
  const reservation = req.body.data;
  const newRes = await service.updateReservation(reservation);
  const result = newRes[0];
  res.status(201).json({ data: result });
}

async function updateStatus(req, res){
  const status = req.body.data.status;
  const reservation = res.locals.reservation;
  let result = await service.updateStatus(reservation.reservation_id, status);
  res.status(200).json({ data: { status: result[0].status } })
}


module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    validDate,
    validStatus,
    noTuesdat,
    hasReservationTime,
    validTime,
    reservationDuringHours,
    noPastReservations,
    hasValidPeople,
    asyncErrorBoundary(create)
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    validDate,
    validStatus,
    noTuesday,
    hasReservationTime,
    validTime,
    reservationDuringHours,
    hasValidPeople,
    asyncErrorboundary(updateReservation),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    notFinished,
    updateValidStatus,
    asyncErrorBoundary(updateStatus),
  ]
};