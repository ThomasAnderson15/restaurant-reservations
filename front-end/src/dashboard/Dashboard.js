import React, {useEffect, useState} from "react";
import { useHistory } from "react-router"
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation"
import Tables from "../tables/Tables"
import { today, previous, next } from "../utils/date-time";
import {listReservations, listTables} from "../utils/api"
import useQuery from "../utils/useQuery"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  const history = useHistory();

 
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then((pulledTables) => {
        const updatedTables = pulledTables.map((table) => {
          return { ...table };
        });
        return updatedTables;
      })
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  
  return (
    <main>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date} </h4>
      </div>

      <div>
        <button className="btn btn-info m-1 p-3"
        onClick={()=> history.push(`/dashboard?date=${previous(date)}`)}>Previous Date</button>
        <button className="btn btn-info m-1 p-3"
        onClick={()=> history.push(`/dashboard?date=${today()}`)}>Today</button>
        <button className="btn btn-info m-1 p-3"
        onClick={()=> history.push(`/dashboard?date=${next(date)}`)}>Next Date</button>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        {reservations.map((res)=> <Reservation key={res.reservation_id} res={res} loadDashboard={loadDashboard} setReservationError={setReservationsError}/>)}
      </div>
      <Tables loadDashboard={loadDashboard} tables={tables} tablesError = {tablesError} />
    </main>
  );
}

export default Dashboard;