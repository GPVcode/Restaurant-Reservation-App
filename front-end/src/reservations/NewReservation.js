import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import FormReservation from "./FormReservation";
import { formatAsDate } from "../utils/date-time";


export default function NewReservation() {
    const history = useHistory();
    const [ resError, setResError ] = useState(null);

    function submitHandler(reservation) {
        const controller = new AbortController();
        setResError(null)
        createReservation(reservation, controller.signal)
            .then((savedReservation) => {
                history.push(
                    `/dashboard?date=${formatAsDate(savedReservation.reservation_date)}`
                )
            })
            .catch(setResError)
        return () => controller.abort();
    }

    function cancelHandler(){
        history.goBack();
    };

    return(
        <main>
            <h1>Create Reservation </h1>
            <ErrorAlert error={resError} />
            <FormReservation 
                onSubmit={submitHandler}
                onCancel={cancelHandler}
            /> 
        </main>
    )
}