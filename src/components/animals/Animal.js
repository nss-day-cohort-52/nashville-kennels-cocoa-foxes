import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import OwnerRepository from "../../repositories/OwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import "./AnimalCard.css"
import { userInfo } from "os";
import EmployeeRepository from "../../repositories/EmployeeRepository";

export const Animal =
    // the name of this component, React is a component based app, with small reusable bits of code called components
    ({ animal, syncAnimals,
        showTreatmentHistory, owners, caretakers }) => {
        const [detailsOpen, setDetailsOpen] = useState(false)
        // declare and deconstruct an array with the useState hook
        // you invoke useState to set up state within your application ex. const [] = useState([]) which only takes a single argument
        // to set the initial value of the state you pass an empty array [] as the argument which is the initial value
        // when you invoke useState it returns you an array
        // you need to write a variable to capture the initial value (in this ex. we use the customers variable)
        // const [customers] = useState([])
        // the second thing the useState hook returns is a function to set the value of the variable later on in the code
        // const [customers, setCustomers] = useState ([]) in this example we use setCustomers
        // the second variable (setCustomers) it's just a variable that holds a fuctions who's job it is to modify state
        // this has established a state variable to hold the state of customers from the API in our application state
        const [isEmployee, setAuth] = useState(false)
        const [myCaretakers, setCare] = useState([])
        const [allCaretakers, registerCaretakers] = useState([])
        //thats the initial state as an argument and returns an array of two entries
        //the second variable within the useState Hook's value is a function
        const [myOwners, setPeople] = useState([])
        const [allOwners, registerOwners] = useState([])
        const [classes, defineClasses] = useState("card animal")
        const { getCurrentUser } = useSimpleAuth()
        const history = useHistory()
        const { animalId } = useParams()
        const { resolveResource, resource: currentAnimal } = useResourceResolver()
        const [description, setDescription] = useState('')

        useEffect(() => {
            setAuth(getCurrentUser().employee)
            resolveResource(animal, animalId, AnimalRepository.get)
        }, [])
        // unlike the useState hook, useEffect takes two arguments
        // the first argument the useEffect takes is a fuction () => {},
        // the second is always an array []
        // useEffect's sole purpose is to run code when certain state changes
        // it invokes the function whenever the state variable changes
        // within the function {} we need a fetch ()
        // when that comes back we need to convert that json encoded string into actual javascript
        // use a .then(res => res.json())
        // when we have the final array of customers, we want it to end up inside the first useState variable (customers)
        // by invoking the setCustomers always to set the value of customers
        // so you'll create the second .then, 
        //.then((customerArray) => {setCustomers(customerArray)})
        // what we did was
        // the api returned a customerArray, and we use the fuction provided to us to invoke (setCustomers) the new state we want
        // which was what was returned from the API (customerArray)
        useEffect(() => {
            if (caretakers) {
                registerCaretakers(caretakers)
            }
        }, [caretakers])
        // useEffect Hook tells you that your component needs to do something after that render

        useEffect(() => {
            resolveResource(animal, animalId, AnimalRepository.get)
        }, [animal])

        useEffect(() => {
            if (owners) {
                registerOwners(owners)
            }
        }, [owners])

        const getPeople = () => {
            return AnimalOwnerRepository
                .getOwnersByAnimal(currentAnimal.id)
                .then(people => setPeople(people))
        }

        useEffect(() => {
            getPeople()
        }, [currentAnimal])

        useEffect(() => {
            if (animalId) {
                defineClasses("card animal--single")
                setDetailsOpen(true)

                AnimalOwnerRepository.getOwnersByAnimal(animalId).then(d => setPeople(d))
                    .then(() => {
                        OwnerRepository.getAllCustomers().then(registerOwners)
                    })
            }
        }, [animalId])


        return (
            //returns JSX or whatever html you want to see in the browser
            <>
                <li className={classes}>
                    <div className="card-body">
                        <div className="animal__header">
                            <h5 className="card-title">
                                <button className="link--card btn btn-link"
                                    style={{
                                        cursor: "pointer",
                                        "textDecoration": "underline",
                                        "color": "rgb(94, 78, 196)"
                                    }}
                                    onClick={() => {
                                        if (isEmployee) {
                                            showTreatmentHistory(currentAnimal)
                                        }
                                        else {
                                            history.push(`/animals/${currentAnimal.id}`)
                                        }
                                    }}> {currentAnimal.name} </button>
                            </h5>
                            <span className="card-text small">{currentAnimal.breed}</span>
                        </div>

                        <details open={detailsOpen}>
                            <summary className="smaller">
                                <meter min="0" max="100" value={Math.random() * 100} low="25" high="75" optimum="100"></meter>
                            </summary>

                            <section>
                                <h6>Caretaker(s)</h6>
                                <span className="small">
                                    Cared for by {myCaretakers.map((caretaker) => {
                                        return caretaker?.user?.name
                                    }).join(" and ")}
                                </span>
                                {
                                    isEmployee && myCaretakers.length < 2
                                        ? <select defaultValue=""
                                            name="caretaker"
                                            className="form-control small"
                                            onChange={(event) => { EmployeeRepository.assignEmployee(currentAnimal.id, parseInt(event.target.value)) }} >
                                            <option value="">
                                                Select {myCaretakers.length === 1 ? "another" : "a"} caretaker
                                            </option>
                                            {
                                                allCaretakers.map(
                                                    c =>
                                                        <option key={c.id} value={c.id}>{c.name}</option>)
                                            }
                                        </select>
                                        : null

                                }

                                <h6>Owners</h6>
                                <span className="small">
                                    Owned by {myOwners.map((owner) => {
                                        return owner?.user?.name
                                    }).join(" and ")}
                                </span>

                                {
                                    myOwners.length < 2
                                        ? <select defaultValue=""
                                            name="owner"
                                            className="form-control small"

                                            onChange={(event) => { AnimalOwnerRepository.assignOwner(currentAnimal.id, parseInt(event.target.value)).then(() => { getPeople() }) }} >
                                            <option value="">
                                                Select {myOwners.length === 1 ? "another" : "an"} owner
                                            </option>
                                            {
                                                allOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                            }
                                        </select>
                                        : null
                                }

                                {
                                    isEmployee
                                        ? <> <h6>Add Treatment:</h6><input id="treatment" value={description} onChange={(event) => {
                                            setDescription(event.target.value)
                                        }
                                        }></input> <button onClick={() => {

                                            AnimalRepository.updateTreatment({
                                                'animalId': currentAnimal.id,
                                                'timestamp': Date.now(),
                                                'description': description
                                            })
                                                .then(() => {
                                                    if (!animalId) {
                                                        syncAnimals()
                                                    }
                                                })
                                                .then(() => {
                                                    setDescription('')
                                                })
                                        }}>submit</button> </>
                                        : ""
                                }


                                {
                                    detailsOpen && "treatments" in currentAnimal
                                        ? <div className="small">
                                            <h6>Treatment History</h6>
                                            {
                                                currentAnimal.treatments.map(t => (
                                                    <div key={t.id}>
                                                        <p style={{ fontWeight: "bolder", color: "grey" }}>
                                                            {new Date(t.timestamp).toLocaleString("en-US")}
                                                        </p>
                                                        <p>{t.description}</p>
                                                    </div>
                                                ))

                                            }
                                        </div>
                                        : ""
                                }

                            </section>

                            {
                                isEmployee
                                    ? <button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                        AnimalOwnerRepository
                                            .removeOwnersAndCaretakers(currentAnimal.id)
                                            .then(() => {
                                                AnimalRepository.delete(currentAnimal.id)
                                            }) // Remove animal
                                            .then(() => {
                                                syncAnimals()
                                            }) // Get all animals
                                            .then(() => {

                                            })
                                    }>Discharge</button>
                                    : ""
                            }

                        </details>
                    </div>
                </li>
            </>
        )
    }
