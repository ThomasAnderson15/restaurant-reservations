import React, { useState } from "react";
import { listReservationsByPhoneNumber } from "../utils/api";
import Reservation from "../reservations/Reservation";
import ErrorAlert from "../layout/ErrorAlert"

export default function Search() {
  const [list, setList] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState(null);

  function handleChange({ target }) {
    setMobileNumber(target.value);
  }

  function handleSearch(event) {
    event.preventDefault();
    setError(null);
    listReservationsByPhoneNumber(mobileNumber)
      .then(setList)
      .catch(setError);
  }
  return (
    <div>
      <ErrorAlert error={error} />
      <h2 className="mt-3 ml-3">Search</h2>
      <form name="reservation" onSubmit={handleSearch}>
        <input
          className="ml-3"
          type="text"
          name="mobile_number"
          placeholder="Enter customer's phone number"
          onChange={handleChange}
          value={mobileNumber}
        ></input>
        <button type="submit" className="btn btn-info m-2 p-3">
          Find
        </button>
      </form>
      {list.length ? (
        <div>
          {list.map(res => <Reservation res={res} />)}
        </div>
      ) : (
        <div>No reservations found</div>
      )}
    </div>
  );
}