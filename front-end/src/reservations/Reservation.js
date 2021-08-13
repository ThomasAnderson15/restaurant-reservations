import React from "react"
import { Link } from "react-router-dom"
import { updateReservationStatus } from "../utils/api"

export default function Reservation ({res, loadDashboard, setReservationError}) {
    
    const handleCancel = (event) => {
        event.preventDefault();
        const confirm = window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        );
        if (confirm) {
          cancelHandler(res.reservation_id);
        }
      };
    function cancelHandler(reservation_id) {
        const abortController = new AbortController();
    
        updateReservationStatus(reservation_id, "cancelled", abortController.status)
          .then(() => {
            return loadDashboard();
          })
          .catch(setReservationError);
        return () => abortController.abort();
    }
    
    
    return (
        <div className="card bg-dark text-light m-1" >
          <div className="card-body">
            <h4 className="card-title">{res.first_name},{res.last_name} Party of: {res.people}</h4>
            <div>Date: {res.reservation_date}, Time: {res.reservation_time}</div>
            <div data-reservation-id-status={res.reservation_id}>{res.status}</div>
            <p className="card-text">{res.mobile_number}</p>
            <p className="card-text">{res.reservation_time}</p>
            <div>{res.status !=="seated" ? <Link
                        to={`/reservations/${res.reservation_id}/seat`}
                        className="btn btn-light m-2"
                        >
                        Seat
                        </Link> : ""}
            <Link to={`/reservations/${res.reservation_id}/edit`} className="btn btn-light m-2">
                        Edit
                        </Link>
                        <button
                        className="btn btn-danger m-2"
                        data-reservation-id-cancel={res.reservation_id}
                        onClick={handleCancel}
                        >
                        Cancel
                        </button>
                        </div>
          </div>            
        </div>
    )
}