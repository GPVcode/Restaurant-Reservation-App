/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");


const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasOnlyValidProperties(req, res, next){
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  
  if(invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}

const hasRequiredProperties = hasProperties("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people");

//create function calls the reservationsService.create method and passes in req.body.data which refers to the object containing reservation info. If promise is resolved successfully, the server responds with a 201 status code with newly created reservation. 
async function create(req, res){
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

async function reservationExists(req, res, next){
  const reservation = await reservationsService.read(req.params.reservationId);
  if(reservation){
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation cannot be found.`});
} 

function read(req, res){
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function list(req, res) {
  const data = await reservationsService.list();
  res.json({ data });
}

module.exports = {
  read: [reservationExists, read],
  create: [hasOnlyValidProperties, hasRequiredProperties, create],
  list,
};
