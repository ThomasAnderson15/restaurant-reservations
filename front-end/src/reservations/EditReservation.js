import React, {useEffect, useState} from "react"
import {useHistory, useParams} from "react-router"
import { editReservation, readReservation } from "../utils/api"

import ErrorAlert from "../layout/ErrorAlert"


export default function EditReservation() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
      });
    const [reservationError, setReservationError] = useState(null);
    const history = useHistory();
    const params = useParams();

    useEffect(loadReservation, []);

    function loadReservation() {
        const abortController = new AbortController();
        setReservationError(null);
        readReservation(params.reservation_id, abortController.signal)
          .then((res) => setFormData({
              ...res,
              reservation_date: new Date(res.reservation_date).toISOString().substr(0, 10)
          }))
          .catch(setReservationError);
        return () => abortController.abort();
    }
       const handleSubmit = (event) => {
            event.preventDefault();
            const abortController = new AbortController();
            editReservation(formData, formData.reservation_id, abortController.signal)
            .then(() =>
                history.push(`/dashboard?date=${formData.reservation_date}`)
            )
            .catch(setReservationError);
            return () => abortController.abort();
       }
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
       return (
        <div>
            <h1>Edit Reservation Form</h1>
            <ErrorAlert error={reservationError} />
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