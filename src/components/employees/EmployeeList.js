import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"


export default ({searchResults}) => {
    const [emps, setEmployees] = useState([])
    const [searchedEmployees, setSearchedEmployees] = useState([])

    useEffect(
        () => {
            EmployeeRepository.getAll().then(setEmployees)
        }, []
    )

    useEffect(
        () => {
            setSearchedEmployees(searchResults)
        }, [searchResults]
    )

    if (searchedEmployees?.length > 0) {
        return (
            <>
                <div className="employees">
                    {
                        searchedEmployees?.map(a => <Employee key={a.id} employee={a} />)
                    }
                </div>
            </>
        )
    } else {
        
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

}
