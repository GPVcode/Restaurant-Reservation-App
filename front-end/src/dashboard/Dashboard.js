import React, { useEffect, useState } from "react";
import { 
  cancelReservation,
  listReservations, 
  listTables 
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservations";
import Table from "../Tables/Table.js";
import makeDate from "./makeDate";

// import { next, previous, today } from "../utils/date-time";
// import DateButtons from "./DateButtons";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

export default function Dashboard() {
  const [dateAugment , setDateAugment] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  


  const loadReservations = () => {
    const abortController = new AbortController();
    const date = makeDate(dateAugment);
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  };

  useEffect(loadReservations, [dateAugment])

  function onCancel(reservation_id) {
    const abortController = new AbortController();
    cancelReservation(reservation_id, abortController.signal)
      .then(loadReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  // const loadTables = () => {
  //   const abortController = new AbortController();
  //   setTablesError(null);
  //   listTables(abortController.signal)
  //     .then(setTables)
  //     .catch(setTablesError);
  //   return () => abortController.abort();
  // };

  // const loadBoth = () => {
  //   const controller = new AbortController();
  //   loadReservations();
  //   loadTables();
  //   return () => controller.abort();
  // };

  
  //previous/today/next buttons
  const buttonSetDate = (event) => {
    event.preventDefault();
    const buttonText = event.target.innerHTML;
    switch (buttonText) {
      case "Previous":
        setDateAugment(state => state - 1)
        break;
      case "Today":
        setDateAugment(0)
        break;
      case "Next":
        setDateAugment(state => state + 1)
        break;
      default:
        break;
    };
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {makeDate(dateAugment)}</h4>
        {/* <h4 className="mb-0">Reservations for {dateAugment}</h4> */}
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="reservations">
      
      {/* <DateButtons
        previous={`/dashboard?date=${previous(date)}`}
        today={`/dashboard?date=${today()}`}
        next={`/dashboard?date=${next(date)}`}
      /> */}
      <Reservation onCancel={onCancel} reservations={reservations} />
      <div className="btn-group" role="group" aria-label="Basic example" style={{marginBottom: 15}}>
        <button type="button" className="btn btn-primary" onClick={buttonSetDate}>
          Previous
        </button>
        <button type="button" className="btn btn-primary" onClick={buttonSetDate}>
          Today
        </button>
        <button type="button" className="btn btn-primary" onClick={buttonSetDate}>
          Next
        </button>
      </div>
      <ErrorAlert error={tablesError} />
      <div className="tables">
        {tables.length < 1 ? <p>Loading...</p> :
        <Table tables={tables} />}
      </div>
      </div>
    </main>
  );
}
