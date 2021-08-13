import React, { useState } from "react";
import { useHistory } from "react-router"
import ErrorAlert  from "../layout/ErrorAlert";
import { postTable } from "../utils/api";

export default function NewTable () {
    const initialFormState = {
        table_name: "",
        capacity: "",
    }
    const [formData, setFormData] = useState({ ...initialFormState });
    const [tableError, setTableError] = useState(null);
    const history = useHistory();

    const handleChange = ({ target }) => {
        let value = target.value;
        if(target.name === "capacity"){
            if(value < 1)
                 value = 1;
        }
        setFormData({
            ...formData,
            [target.name]: value,
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        postTable(formData).then(response => {
                        history.push(`/dashboard`)
                    }).catch((error)=>{
                        console.log("Error",error);
                        setTableError(error)});
      };

    return (
        <div>
            <h1>New Table Form</h1>
            <ErrorAlert error={tableError} />
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_name">
                    Enter the Table's Name:
                    <input
                        id="table_name"
                        type="text"
                        name="table_name"
                        onChange={handleChange}
                        value={formData.table_name} 
                        required />
                </label>
                <label htmlFor="capacity">
                    Enter Table's Capacity:
                    <input
                        id="capacity"
                        type="number"
                        name="capacity"
                        onChange={handleChange}
                        value={formData.capacity} 
                        required />
                </label>
                <button type="submit">Submit</button>
            </form>
            <button type="cancel" onClick={()=>history.goBack()}>Cancel</button>
        </div>
    )
}
