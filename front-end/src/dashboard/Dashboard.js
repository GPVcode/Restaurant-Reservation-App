import React, { useEffect, useState } from "react";
import { listReservations, deleteTableReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "./Reservations";
import { useHistory, useLocation } from "react-router-dom"
import { previous, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  //today's reservations
  function handleToday(){
    history.push(`/dashboard`);
  }

  //previous reservations
  function handlePrev(){
    const newDate = previous(date);
    history.push(`/dashboard?date=${newDate}`);
  }

  //upcoming reservations
  function handleNext(){
    history.push(`/dashboard?date=${next(date)}`);
  }

  // cancel reservation
  async function onCancel(reservation){
    try{
      const { status } = await deleteTableReservation(reservation.reservation_id);
      const updated = reservations.map((res) => {
        if(res.reservation_id === reservation.reservation_id){
          res.status = status;
        }
        return res;
      });
      setReservations(updated);
      history.go(`/dashboard?date=${reservation.reservation_date}`);
    } catch(error){
      setReservationsError(error)
    }
  }

   function onCancel(reservation_id) {
    deleteTableReservation(reservation_id).then(loadDashboard).catch(setReservationsError);
  }

  // finish table
  function onFinish(table_id, reservation_id) {
    // finishTable(table_id, reservation_id).then(loadDashboard).catch(setReservationsError);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div>
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="pb-2">
        <button className="btn btn-primary mr-1" onClick={handleToday}>
          today
        </button>
        <button className="btn btn-primary mr-1" onClick={handlePrev}>
          previous
        </button>
        <button className="btn btn-primary mr-1"onClick={handleNext}>
          next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
      <Reservations 
        reservations={reservations} 
        setReservations={setReservations}
        setError={setReservationsError}
        onCancel={onCancel}
      />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
    </main>
  );
}

export default Dashboard;
