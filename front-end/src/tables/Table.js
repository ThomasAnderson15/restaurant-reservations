import React from "react";






export default function Table({table, clearTable}) {


  function handleClick() {
      clearTable(table.table_id);
  }
  return (
    <div className="card mx-1 my-2" >
      <div className="card-body bg-secondary text-light">
        <h4 className="card-title">{table.table_name}</h4>
        <p className="card-text">Capacity: {table.capacity}</p>
        <p className="card-text" data-table-id-status={table.table_id}>{table.reservation_id ? "occupied"
        : "free"}</p>
        <div>{table.reservation_id ? <button data-table-id-finish={table.table_id} onClick={handleClick}>Finish</button>
        : ""}</div>
      </div>
    </div>
  );
}