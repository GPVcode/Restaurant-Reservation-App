import React from "react"

function New() {


const submitHandler = e => {
    e.preventDefault()
    console.log("saved to useState")
}
  return (
    <main>
        <form onSubmit={submitHandler}>
            <div>
            <input 
                name="first_name"
                placeholder="first name"
                type="text"
            />
            <input 
                name="last_name" 
                placeholder="last name"
                type="text"
            />
            <input 
                name="mobile_number" 
                placeholder="phone number"
                type="text"
            />
            <input 
                name="reservation_date" 
                placeholder="date"
                type="date"
            />
            <input 
                name="reservation_time" 
                placeholder="time"
                type="time"
            />
            <input 
                name="people" 
                placeholder="party size"
                type="number"
                min="1"
            />
            </div>
            <div>
            <input 
                type="submit" 
                value="Submit" 
            />
            </div>
        </form>
    </main>
  );
}

export default New;
