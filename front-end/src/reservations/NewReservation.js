import React, { useState} from "react"
// import CreateReservation from "./FormReservation";
import FormReservation from "./FormReservation";
function NewReservation() {

//     const initialState = {
//         first_name: "",
//         last_name: "",
//         phone_number: "",
//         reservation_date: "",
//         reservation_time: "",
//         people: 1
//     }

// const [ formData, setFormData ] = useState(initialState);
// const [ reservations, setReservations ] = useState([]);
// console.log(formData)
  return (
    <main>
      <h1> Create a New Reservation </h1>
      <FormReservation />
    </main>
  );
  // return (
  //   <>
  //       <CreateReservation 
  //           formData={formData} 
  //           setFormData={setFormData} 
  //           reservations={reservations} 
  //           setReservations={setReservations}/>
  //   </>
  // );
}

export default NewReservation;