import React, { useState, useContext, useEffect } from "react"
import "./AnimalForm.css"
import AnimalRepository from "../../repositories/AnimalRepository";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import { useHistory } from "react-router";
import LocationRepository from "../../repositories/LocationRepository";



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

    useEffect(() => {
        setLocations(LocationRepository.getAll())
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
                employeeId: eId,
                locationId: locationId
            }

            AnimalRepository.addAnimal(animal)
                .then(() => setEnabled(true))
                .then(() => props.history.push("/animals"))
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
                    {employees.map(l => (
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
                                const matchingLocation = 
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
