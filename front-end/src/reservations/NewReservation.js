import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import ErrorAlert  from "../layout/ErrorAlert";
import {postReservation} from "../utils/api";



export default function NewReservation ({date}) {
   const history = useHistory();
   const initialFormState = {
       first_name: "",
       last_name: "",
       mobile_number: "",
       reservation_date: date,
       reservation_time: "10:30",
       people: 1
   }

   const [formData, setFormData] = useState(initialFormState);
   const [reservationsError, setReservationsError] = useState(null);



   const handleChange = ({ target }) => {
       let value = target.value;

       if(target.name === "people"){
           if(value < 1)
                value = 1;
        value = Number(value);
       }
       setFormData({
           ...formData,
           [target.name]: value,
       });
   };

   const handleSubmit = (event) => {
    event.preventDefault();
    postReservation(formData).then(response => {
                    history.push(`/dashboard?date=${formData.reservation_date}`)
                }).catch((error)=>{
                    console.log("Error",error);
                    setReservationsError(error)});
  };
    return (
        <div>
            <h1>New Reservation Form</h1>
            <ErrorAlert error={reservationsError} />
            <form onSubmit={handleSubmit}>
                <label htmlFor="first_name">
                    Enter Your First Name:
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        onChange={handleChange}
                        value={formData.first_name} />
                </label>
                <label htmlFor="last_name">
                    Enter Your Last Name:
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        onChange={handleChange}
                        value={formData.last_name} />
                </label>
                <label htmlFor="mobile_number">
                    Enter Mobile Number:
                    <input
                        id="mobile_number"
                        type="tel"
                        name="mobile_number"
                        onChange={handleChange}
                        value={formData.mobile_number} />
                </label>
                <label htmlFor="reservation_date">
                    Select Reservation Date:
                    <input
                        id="reservation_date"
                        type="date"
                        name="reservation_date"
                        onChange={handleChange}
                        value={formData.reservation_date} />
                </label>
                <label htmlFor="reservation_time">
                    Select Reservation Time:
                    <input
                        id="reservation_time"
                        type="time"
                        name="reservation_time"
                        onChange={handleChange}
                        value={formData.reservation_time} />
                </label>
                <label htmlFor="people">
                    Set number of guests:
                    <input
                        id="people"
                        type="number"
                        name="people"
                        onChange={handleChange}
                        value={formData.people} />
                </label>
                <button type="submit">Submit</button>
            </form>
            <button type="cancel" onClick={()=>history.goBack()}>Cancel</button>
        </div>
    )
}