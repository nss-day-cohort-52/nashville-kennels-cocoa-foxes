import React, { useEffect, useState } from "react"
import LocationRepository from "../../repositories/LocationRepository";
import Location from "./Location"
import "./LocationList.css"


export const LocationList = ({searchResults}) => {
    const [ locations, updateLocations ] = useState([])
    const [searchedLocations, setSearchedLocations] = useState([])

    useEffect(() => {
        LocationRepository.getAll().then(updateLocations)
    }, [])

    useEffect(() => {
        setSearchedLocations(searchResults)
    },[searchResults])

    if (searchedLocations?.length > 0) {
        return (
            <div className="locations">
                {searchedLocations?.map(l => <Location key={l.id} location={l} />)}
            </div>
        )
    } else {
        
        return (
            <div className="locations">
                {locations?.map(l => <Location key={l.id} location={l} />)}
            </div>
        )
    }
}
