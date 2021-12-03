import React, { useState, useContext, useEffect } from "react"
import "./AnimalForm.css"
import AnimalRepository from "../../repositories/AnimalRepository";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import { useHistory } from "react-router";
import LocationRepository from "../../repositories/LocationRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";



export default (props) => {
    const [animalName, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [animals, setAnimals] = useState([])
    const [employees, setEmployees] = useState([])
    const [employeeId, setEmployeeId] = useState(0)
    const [saveEnabled, setEnabled] = useState(false)
    const history = useHistory()
    const [locationId, setLocationId] = useState(0)
    const [locations, setLocations] = useState([])
    const { getCurrentUser } = useSimpleAuth()

    useEffect(() => {
        LocationRepository.getAll()
            .then(setLocations)
    }, [])

    useEffect(() => {
        EmployeeRepository.getAll()
            .then(setEmployees)
    }, [])

    const constructNewAnimal = evt => {
        evt.preventDefault()
        const eId = parseInt(employeeId)

        if (eId === 0) {
            window.alert("Please select a caretaker")
        } else {
            const emp = employees.find(e => e.id === eId)
            const animal = {
                name: animalName,
                breed: breed,
                locationId: locationId
            }
            if (animalName && breed && employeeId && locationId) {

                AnimalRepository.addAnimal(animal)
                .then((res) => {
                    AnimalOwnerRepository.assignOwner(res.id, getCurrentUser().id)
                    EmployeeRepository.assignEmployee(res.id, eId)
                })
                    .then(() => setEnabled(true))
                    .then(() => history.push("/animals"))
            } else {
                window.alert("Please fill out all fields before submitting")
            }
        }
    }

    return (
        <form className="animalForm">
            <h2>Admit Animal to a Kennel</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <input
                    type="text"
                    required
                    autoFocus
                    className="form-control"
                    onChange={e => setName(e.target.value)}
                    id="animalName"
                    placeholder="Animal name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={e => setBreed(e.target.value)}
                    id="breed"
                    placeholder="Breed"
                />
            </div>

            <div className="form-group">
                <label htmlFor="location">Choose a Location</label>
                <select
                    defaultValue=""
                    name="location"
                    id="locationId"
                    className="form-control"
                    onChange={e => setLocationId(parseInt(e.target.value))}
                >
                    <option value="">Choose a Location</option>
                    {locations.map(l => (
                        <option key={l.id} id={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                </select>
            </div>
            {
                locationId !== 0
                    ? <div className="form-group">
                        <label htmlFor="employee">Make appointment with caretaker</label>
                        <select
                            defaultValue=""
                            name="employee"
                            id="employeeId"
                            className="form-control"
                            onChange={e => setEmployeeId(e.target.value)}
                        >
                            <option value="">Select an employee</option>
                            {employees.filter((employee) => {
                                const matchingLocation = employee?.employeeLocations?.find(location => location.locationId === locationId)
                                if (matchingLocation) {
                                    return employee
                                }
                            }).map(e => (
                                <option key={e.id} id={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    : ""
            }

            <button type="submit"
                onClick={constructNewAnimal}
                disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}
