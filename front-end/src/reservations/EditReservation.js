import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import FormReservation from "./FormReservation";
import { formatAsDate } from "../utils/date-time";

export default function Edit() {
    const history = useHistory()
    const { reservation_id } = useParams();
    const [ reservation, setReservation ] = useState({});
    const [ resError, setResError ] = useState(null);

    const loadReservation = () => {
        const controller = new AbortController();
        setResError(null);
        readReservation(reservation_id, controller.signal)
            .then(setReservation)
            .catch(setResError);
        return () => controller.abort();
    };

    useEffect(loadReservation, [reservation_id])

    function submitHandler(reservation) {
        const controller = new AbortController();
        setResError(null)
        updateReservation({
                reservation_id,
                ...reservation
            }, 
            controller.signal
        )
        .then((updatedReservation) => {
            history.push(
                `/dashboard?date=${formatAsDate(updatedReservation.reservation_date)}`
            )
        })
        .catch(setResError)
        return () => controller.abort();
        // .then((updatedReservation) => {
        //     const res_date = updatedReservation.reservation_date.match(/\d{4}-\d{2}-\d{2}/)[0];
        //     history.push(
        //     `/dashboard?date=`+res_date
        //     )
        // })
       
    }

    function cancelHandler(){
        history.goBack();
    };

    const child = reservation.reservation_id 
        ? (
            <FormReservation 
                initialState={reservation}
                onSubmit={submitHandler}
                onCancel={cancelHandler}
            /> 
          )
        : (
            <p>Loading...</p>
        );

    return (
        <main>
            <h1>Edit Reservation #{reservation.reservation_id}</h1>
            <ErrorAlert error={resError} />
            {child}
        </main>
    )
}