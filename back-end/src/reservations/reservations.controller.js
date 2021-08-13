const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
function validateReservation (req, res, next) {
  const {data: {first_name, last_name, mobile_number, reservation_date, reservation_time, people, status} ={}} = req.body;
    
    let temp_reservation_time = reservation_time && reservation_time.replace(":","");
    let regExp = /[a-zA-Z]/g;
     
      if(!first_name || first_name === "first name" || first_name === "" || first_name.includes(" ")){
        next({ status: 400, message: "Need a valid (first_name) First Name!"})
      }
      else if(!last_name || last_name === "last name" || last_name === ""){
        next({ status: 400, message: "Need a valid (last_name) Last Name!"})
      }
      else if(!mobile_number || mobile_number.length < 7 || mobile_number === "555-555-5555" ){
        next({ status: 400, message: "Need a valid (mobile_number) phone number!"})
      }
      else if(!reservation_date || regExp.test(reservation_date)){
        next({ status: 400, message: "Reservation date (reservation_date) is missing!"})
      }
      else if(Date.parse(reservation_date) < Date.now()){
        next({ status: 400, message: "Reservation (reservation_date) needs to be on a future date!"})
      }
      else if(new Date(reservation_date).getDay()+1 === 2){
        next({ status: 400, message: "We are closed on Tuesdays! Pick a day (reservation_date) when we are open."});
      }
      else if(!reservation_time || regExp.test(temp_reservation_time)){
        next({ status: 400, message: "(reservation_time) is missing or not a time!"});
      }
      else if(temp_reservation_time < 1030){
        next({ status: 400, message: "Reservation (reservation_time) cannot be before business hours!"});
      }
      else if(temp_reservation_time > 2130){
        next({ status: 400, message: "Reservation (reservation_time) cannot be less than one hour before business closing!"});
      }
      else if(!people || people < 1){
        next({ status: 400, message: "Reservation needs people!"});
      }
      else if(typeof req.body.data.people !== "number"){
        next({ status: 400, message: "people needs to be a number!"});
      }
      else if(status === "seated" || status === "finished"){
        next({ status: 400, message: "Created reservation cannot be seated or finished"});
      }
      else{
        next();
      }
}
async function isTimeTaken(req, res, next) {
  const {data: {reservation_date, reservation_time} ={}} = req.body;
  const data = await service.findByDateAndTime(reservation_date, reservation_time);
  if(data.length)
    next({ status: 400, message: "Reservation already scheduled for this time!"});

  next();
}
function updateValidation(req, res, next) {
  const reqStatus = req.body.data.status;
  const status = res.locals.reservation.status;

  if (
    reqStatus !== "booked" &&
    reqStatus !== "seated" &&
    reqStatus !== "finished" &&
    reqStatus !== "cancelled"
  ) {
    next({
      status: 400,
      message: "unknown status.",
    });
  }

  if (status === "finished") {
    next({
      status: 400,
      message: "a finished reservation cannot be updated.",
    });
  }

  next();
}
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data })
}
async function list(req, res) {
    const { date, mobile_number } = req.query;
    if(date){
    const data = await service.list(date);
    res.json({ data });
    }
    else{
      const data = await service.search(mobile_number)
      res.json({ data });
    }   
}
async function reservationExists(req, res, next) {

    const resId = req.params.reservation_id;
    const reservation = await service.read(resId);

    if (reservation) {
        res.locals.reservation = reservation;
        next();
      } else {
        next({
          status: 404,
          message: `Reservation: ${resId} is missing.`,
        });
    }

}
async function read(req, res) {
  const data = res.locals.reservation;
  res.status(200).json({ data });
}
async function update(req, res) {
  
  const reservation_id = req.params.reservation_id;
  const status = req.body.data.status;

  const updateStatus = await service.update(reservation_id, status);
  res.status(200).json({ data: updateStatus });
}
async function editReservation(req, res) {
  const editedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.editReservation(editedReservation);
  res.status(200).json({ data: data[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateReservation, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), updateValidation, asyncErrorBoundary(update)],
  editReservation: [asyncErrorBoundary(reservationExists), validateReservation, asyncErrorBoundary(editReservation)]
};
