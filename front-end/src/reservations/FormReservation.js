import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import { createReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function FormReservation({
  onSubmit,
  onCancel,
  initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked",
  }
}) {
  
  // let defaultReservationData = reservation ? reservation :
  //   {
  //     first_name: "",
  //     last_name: "",
  //     mobile_number: "",
  //     reservation_date: "",
  //     reservation_time: "",
  //     people: 0,
  //     status: "booked",
  //     };
  console.log("initialState form-res: ", initialState)

  const [reservationData, setReservationData] = useState(initialState);
  const [errors, setResError] = useState(null);
  // const history = useHistory();

  const changeHandler = (event) => {
    event.preventDefault();
    setReservationData({
      ...reservationData,
      [event.target.name]: event.target.value,
    });
  };

  // const changeHandler = ({target: { name, value }}) => {
  //   setReservationData((previousReservation) => ({
  //     ...previousReservation,
  //     [name]: value,
  //   }));
  // }

  const numberChangeHandler = ({target: { name, value }}) => {
    setReservationData((previousReservation) => ({
      ...previousReservation,
      [name]: Number(value),
    }));
  }

  function validate(reservation){
    const createResError = []
    function isFutureDate({ reservation_date, reservation_time }) {
      const dt = new Date(`${reservation_date}T${reservation_time}`);
      if (dt < new Date()) {
          errors.push(new Error("Reservation must be set in the future"));
      }
    }

    function isTuesday({ reservation_date }) {
      const day = new Date(reservation_date).getUTCDay();
      if (day === 2) {
        errors.push(new Error("No reservations available on Tuesday."));
      }
    }

    function isOpenHours({ reservation_time }){
      const hour = parseInt(reservation_time.split(":")[0]);
      const mins = parseInt(reservation_time.split(":")[1]);

      if (hour <= 10 && mins <= 30){
          errors.push(new Error("Restaurant is only open after 10:30 am"));
      }

      if (hour >= 22){
          errors.push(new Error("Restaurant is closed after 10:00 pm"));
      }
    }

    isFutureDate(reservation);
    isTuesday(reservation);
    isOpenHours(reservation);

    return createResError;
}
  
  const submitHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if(reservationData.reservation_time.length === 8){
      reservationData.reservation_time = reservationData.reservation_time.slice(0, -3)
    }
    // if(createResError.length) {
    //   return setResError(error)s
    // }
    onSubmit(reservationData)

    console.log(`Reservation Data: `, reservationData)

    // reservationData.people = Number(reservationData.people)
    // const controller = new AbortController();
    // if (reservation) {
    //   updateReservation(reservationData, controller.signal) 
    //     .then(() => history.push("/"))
    //     .catch(setResError);
    // } else {
    //   createReservation(reservationData, controller.signal) 
    //     .then(() => history.push("/"))
    //     .catch(setResError);
    // }
    // return () => controller.abort();
  };

  // const cancelHandler = (event) => {
  //   event.preventDefault();
  //   const controller = new AbortController();
  //   history.goBack();
  //   return () => controller.abort();
  // };

  return (
      <form onSubmit={submitHandler}>
        <ErrorAlert error={errors} />
        <fieldset>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              className="form-control"
              name="first_name"
              id="first_name"
              placeholder="First Name"
              value={reservationData.first_name}
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="last_name"
              id="last_name"
              placeholder="Last Name"
              value={reservationData.last_name}
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="number"
              className="form-control no-arrow"
              name="mobile_number"
              id="mobile_number"
              placeholder="Mobile Number"
              value={reservationData.mobile_number}
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
              type="date"
              className="form-control"
              name="reservation_date"
              id="reservation_date"
              // pattern="\d{2}\/\d{2}\/\d{4}"
              pattern="\d{4}-\d{2}-\d{2}"
              // value={new Date(reservationData.reservation_date).toISOString().substring(0, 10)}
              value={reservationData.reservation_date}
              required={true}
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservation_time">Reservation Time</label>
            <input
              type="time"
              // min="10:30"
              // max="21:30"
              className="form-control"
              name="reservation_time"
              id="reservation_time"
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              value={reservationData.reservation_time}
              required={true}
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="people">Number of People</label>
            <input
              type="number"
              className="form-control"
              name="people"
              id="people"
              required={true}
              min={1}
              placeholder="Number of People"
              value={reservationData.people}
              onChange={numberChangeHandler}
            />
          </div>
          <button type="submit" className="btn btn-primary m-1">
            Submit
          </button>
          <button 
            type="button" 
            className="btn btn-danger m-1"
            onClick={onCancel}
          >
              <span className="oi oi-x" /> Cancel
          </button>
        </fieldset>
      </form>
  );
}