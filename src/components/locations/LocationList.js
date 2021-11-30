import React, { useEffect, useState } from "react"
import LocationRepository from "../../repositories/LocationRepository";
import Location from "./Location"
import "./LocationList.css"


export const LocationList = ({searchResults}) => {
    const [ locations, updateLocations ] = useState([])

    useEffect(() => {
        LocationRepository.getAll().then(updateLocations)
    }, [])

    useEffect(() => {
        updateLocations(searchResults)
    },[searchResults])


    return (
        <div className="locations">
            {locations?.map(l => <Location key={l.id} location={l} />)}
        </div>
    )
}
