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
    const [locations, changeLocation] = useState([])

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    //resolveResouece takes three arguments = property, parameter, getter

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [employee])

    useEffect(() => {
        if (resource?.locations?.length > 0) {
            markLocation(resource.locations[0])
        }
    }, [resource])

    useEffect(() => {
        setCount(resource?.animalCaretakers?.length)
    }, [])

    useEffect(() => {
        LocationRepository
            .getAll()
            .then((res) => locations.push(...res))

    }, [])

    useEffect(() => {
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [employeeId])

    const fireEmployee = (id) => {
        EmployeeRepository
            .delete(id)
            .then(EmployeeRepository.getAll)
            .then(() => { history.push("/employees") })
    }

    const assignLocation = (locationId) => {
        const locationObj = {
            userId: parseInt(employeeId),
            locationId: locationId,
        } 
        EmployeeRepository.assignLocation(locationObj)
        resolveResource(employee, employeeId, EmployeeRepository.get)
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
                                Working at {resource?.locations?.map((location) => {
                                    return <Link className="card-link"
                                        to={{
                                            pathname: `/locations/${location?.location?.id}`
                                        }}>
                                        {location?.location?.name}
                                    </Link>
                                })

                                } location
                            </section>
                        </>
                        : ""
                }

                {
                    employeeId
                        ? isEmployee
                            ? <><button className="btn--fireEmployee" onClick={() => { fireEmployee(resource.id) }}>Fire</button>
                                <label for="location-select">Choose a location:</label>
                                {resource?.locations?.length < 2
                                    ? <select name="locations" id="location-select" onChange={(evt) => assignLocation(parseInt(evt.target.value))} >
                                        <option value="">--Please choose a location--</option>
                                        {locations.map((loc) => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select> :
                                    ""}
                            </>
                            : ""
                        : ""
                }

            </section>

        </article>
    )
}
