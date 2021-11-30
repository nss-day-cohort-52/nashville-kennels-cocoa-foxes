import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"


export default ({searchResults}) => {
    const [emps, setEmployees] = useState([])

    useEffect(
        () => {
            EmployeeRepository.getAll().then(setEmployees)
        }, []
    )

    useEffect(
        () => {
            setEmployees(searchResults)
        }, [searchResults]
    )

    return (
        <>
            <div className="employees">
                {
                    emps?.map(a => <Employee key={a.id} employee={a} />)
                }
            </div>
        </>
    )
}
