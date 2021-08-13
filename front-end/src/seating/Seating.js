import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { updateTable } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
import {listTables} from "../utils/api"

export default function Seating () {
    const [reservationSeatingError, setReservationSeatingError] = useState(null)
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [tableId, setTableId] = useState(null);
    const params = useParams();
    const history = useHistory();

    useEffect(loadTables, []);
    function loadTables() {
        const abortController = new AbortController();
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


    const handleChange = (event) => {
        return event.target.value ? setTableId(event.target.value) : setTableId(null);
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setReservationSeatingError(null);

        updateTable(tableId, params.reservation_id)
            .then(() => history.push("/dashboard/"))
            .catch(setReservationSeatingError);
      }
    if(tables){
        return (
            <main>
                <ErrorAlert error={tablesError} />
                <ErrorAlert error={reservationSeatingError} />
                <h3>Seating for reservation {params.reservation_id}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="select_table"></label>
                        <select
                        onChange={handleChange}
                        className="form-control"
                        id="select_table"
                        name="table_id"
                        >
                        <option key={0} value={0}>
                    --- Please select an option ---
                        </option> 
                        {tables.map((table, index) => {
                            console.log(`${table.table_name} - ${table.capacity}`);
                            return (
                            <option key={index} value={table.table_id}>{table.table_name} - {table.capacity}</option>);
                        })}
                        </select>
                    </div>
                    <div>
                        <button className="btn btn-secondary m-2" type="submit">
                        Submit
                        </button>
                        <button
                        onClick={() => history.goBack()}
                        className="btn btn-danger"
                        >
                        Cancel
                        </button>
                    </div>
                </form>
            </main>
        )}
}