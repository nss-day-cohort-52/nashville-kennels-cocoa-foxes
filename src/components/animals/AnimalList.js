import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Animal } from "./Animal"
import { AnimalDialog } from "./AnimalDialog"
import AnimalRepository from "../../repositories/AnimalRepository"
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository"
import useModal from "../../hooks/ui/useModal"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import OwnerRepository from "../../repositories/OwnerRepository"

import "./AnimalList.css"
import "./cursor.css"


export const AnimalListComponent = ({searchResults}) => {
    const [animals, petAnimals] = useState([])
    const [animalOwners, setAnimalOwners] = useState([])
    const [owners, updateOwners] = useState([])
    const [currentAnimal, setCurrentAnimal] = useState({ treatments: [] })
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    let { toggleDialog, modalIsOpen } = useModal("#dialog--animal")

    const syncAnimals = () => {
        AnimalRepository.getAll().then(data => petAnimals(data))
    }

    const [searchedAnimals, updatedAnimals] = useState([])
    useEffect(() => {
        updatedAnimals(searchResults)
    }, [searchResults])

    useEffect(() => {
        OwnerRepository.getAllCustomers().then(updateOwners)
        AnimalOwnerRepository.getAll().then(setAnimalOwners)
        syncAnimals()
    }, [])

    const showTreatmentHistory = animal => {
        setCurrentAnimal(animal)
        toggleDialog()
    }

    useEffect(() => {
        const handler = e => {
            if (e.keyCode === 27 && modalIsOpen) {
                toggleDialog()
            }
        }

        window.addEventListener("keyup", handler)

        return () => window.removeEventListener("keyup", handler)
    }, [toggleDialog, modalIsOpen])


    if (searchedAnimals?.length > 0) {
        return (
            <>
                <AnimalDialog toggleDialog={toggleDialog} animal={currentAnimal} />
    
    
                {
                    getCurrentUser().employee
                        ? ""
                        : <div className="centerChildren btn--newResource">
                            <button type="button"
                                className="btn btn-success "
                                onClick={() => { history.push("/animals/new") }}>
                                Register Animal
                            </button>
                        </div>
                }
    
    
                <ul className="animals">
                    {
                        searchedAnimals?.map(anml =>
                            <Animal key={`animal--${anml.id}`} animal={anml}
                                animalOwners={animalOwners}
                                owners={owners}
                                syncAnimals={syncAnimals}
                                setAnimalOwners={setAnimalOwners}
                                showTreatmentHistory={showTreatmentHistory}
                            />)
                    }
                </ul>
            </>
        )
    } else {


    return (
        <>
            <AnimalDialog toggleDialog={toggleDialog} animal={currentAnimal} />


            {
                getCurrentUser().employee
                    ? ""
                    : <div className="centerChildren btn--newResource">
                        <button type="button"
                            className="btn btn-success "
                            onClick={() => { history.push("/animals/new") }}>
                            Register Animal
                        </button>
                    </div>
            }


            <ul className="animals">
                {
                    animals?.map(anml =>
                        <Animal key={`animal--${anml.id}`} animal={anml}
                            animalOwners={animalOwners}
                            owners={owners}
                            syncAnimals={syncAnimals}
                            setAnimalOwners={setAnimalOwners}
                            showTreatmentHistory={showTreatmentHistory}
                        />)
                }
            </ul>
        </>
    )
}

}
