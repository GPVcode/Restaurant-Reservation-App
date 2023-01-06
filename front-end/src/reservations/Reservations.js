import { useHistory } from "react-router-dom";
import { cancelReservation } from "../utils/api";

export default function Reservation({ reservations }) {
  const history = useHistory();

  const cancelHandler = (reservation_id) => {
    const controller = new AbortController();
    const alert = window.confirm("Do you really want to change this?");

    if (alert) {
      cancelReservation(reservation_id, controller.signal).then(() =>
        history.push("/")
      );
    }
  };

  function toStandardTime(reservation_time) {
    let time = reservation_time.split(':'); // convert to array

    // fetch
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var seconds = Number(time[2]);

    // calculate
    var timeValue;

    if (hours > 0 && hours <= 12) {
      timeValue= "" + hours;
    } else if (hours > 12) {
      timeValue= "" + (hours - 12);
    } else if (hours == 0) {
      timeValue= "12";
    }
    
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

    // show
    return timeValue;
  }
  

  
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">Reservation Day</th>
          <th scope="col">Reservation Time</th>
          <th scope="col">Number of People</th>
          <th scope="col">Status</th>
          <th scope="col">Options</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map(
          (
            {
              reservation_id,
              first_name,
              last_name,
              mobile_number,
              reservation_date,
              reservation_time,
              people,
              status,
            }
          ) => {
            if (status !== "finished") {
              return (
                <tr key={reservation_id}>
                  <td>{first_name}</td>
                  <td>{last_name}</td>
                  <td>{mobile_number}</td>
                  <td>{reservation_date}</td>
                  <td>{toStandardTime(reservation_time)}</td>
                  <td>{people}</td>
                  <td>{status}</td>
                  <td>
                    {status === "booked" ? (
                      <>
                        <a
                          className="btn btn-primary m-1"
                          href={`/reservations/${reservation_id}/edit`}
                          role="button"
                        >
                          Edit
                        </a>
                        <a
                          className="btn btn-primary m-1"
                          href={`/reservations/${reservation_id}/seat`}
                          role="button"
                        >
                          Seat
                        </a>
                        <button
                          type="button"
                          className="btn btn-danger m-1"
                          onClick={(event) => cancelHandler(reservation_id)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            }
            return null;
          }
        )}
      </tbody>
    </table>
  );
}
