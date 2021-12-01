import React, { useState, useEffect } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"
import LocationRepository from "../../repositories/LocationRepository";


export default ({ employee }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const history = useHistory()
    const [isEmployee, setAuth] = useState(false)

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    useEffect(() => {
        if (resource?.locations?.length > 0) {
            markLocation(resource.locations[0])
        }
    }, [resource])
    
    useEffect(()=>{
        setCount(resource?.animalCaretakers?.length)
    })

    const fireEmployee = (id) => {
        EmployeeRepository
            .delete(id)
            .then(EmployeeRepository.getAll)
            .then(() => { history.push("/employees") })
    }

    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId
                            ? resource.name
                            : <> <Link className="card-link"
                                to={{
                                    pathname: `/employees/${resource.id}`,
                                    state: { employee: resource }
                                }}>
                                {resource.name}
                            </Link>

                        <section>Caring for {animalCount} animals</section></>
                    }
                </h5>
                
                {
                    employeeId
                        ? <>
                            <section>
                                Caring for {resource?.animals?.length} animals
                            </section>
                            <section>
                                Working at {location?.location?.name} location
                            </section>
                        </>
                        : ""
                }

                {
                    employeeId
                        ? isEmployee
                            ? <button className="btn--fireEmployee" onClick={() => { fireEmployee(resource.id) }}>Fire</button>
                            : ""
                        : ""
                }

            </section>

        </article>
    )
}
