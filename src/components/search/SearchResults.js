import React from "react"
import { useLocation } from "react-router-dom";
import { AnimalListComponent } from "../animals/AnimalList";
import EmployeeList from "../employees/EmployeeList";
import { LocationList } from "../locations/LocationList";
import "./SearchResults.css"


export default () => {
    const location = useLocation()

    const displayAnimals = () => {
        if (location.state?.animals.length > 0) {
            return (
                <React.Fragment>
                    <h2>Matching Animals</h2>
                    <section className="animals">
                        <div>
                            <AnimalListComponent searchResults={location.state.animals} />
                        </div>

                    </section>
                </React.Fragment>
            )
        }
    }

    const displayEmployees = () => {
        if (location.state?.employees.length > 0) {
            return (
                <React.Fragment>
                    <h2>Matching Employees</h2>
                    <section className="employees">
                        <div>
                            <EmployeeList searchResults={location.state.employees} />
                        </div>

                    </section>
                </React.Fragment>
            )
        }
    }

    const displayLocations = () => {
        if (location.state?.locations.length > 0) {
            return (
                <React.Fragment>
                    <h2>Matching Locations</h2>
                    <section className="locations">
                        <div>
                            <LocationList searchResults={location.state.locations} />
                        </div>
                    </section>
                </React.Fragment>
            )
        }
    }

    return (
        <React.Fragment>
            <article className="searchResults">
                {displayAnimals()}
                {displayEmployees()}
                {displayLocations()}
            </article>
        </React.Fragment>
    )
}
