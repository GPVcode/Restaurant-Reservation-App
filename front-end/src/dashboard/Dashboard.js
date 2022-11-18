import React, { useEffect, useState } from "react";
import { listReservations, cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "./Reservations";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  console.log(reservations)
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // cancel reservation
  function onCancel(reservation_id) {
    cancelReservation(reservation_id).then(loadDashboard).catch(setReservationsError);
  }

  // finish table
  function onFinish(table_id, reservation_id) {
    // finishTable(table_id, reservation_id).then(loadDashboard).catch(setReservationsError);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
      <Reservations reservations={reservations} onCancel={onCancel}/>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
    </main>
  );
}

export default Dashboard;
