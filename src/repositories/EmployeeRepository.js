import Settings from "./Settings"
import { fetchIt } from "./Fetch"

export default {
    async get(id) {
        const userLocations = await fetchIt(`${Settings.remoteURL}/employeeLocations?userId=${id}&_expand=location&_expand=user`)
        return await fetchIt(`${Settings.remoteURL}/animalCaretakers?userId=${id}&_expand=animal`)
            .then(data => {
                const userWithRelationships = userLocations[0].user
                userWithRelationships.locations = userLocations
                userWithRelationships.animals = data
                return userWithRelationships
            })
    },
    async delete(id) {
        return await fetchIt(`${Settings.remoteURL}/users/${id}`, "DELETE")
    },
    async addEmployee(employee) {
        return await fetchIt(`${Settings.remoteURL}/users`, "POST", JSON.stringify(employee))
    },

    async getCaretakersByAnimal (animalId) {
        const e = await fetch(`${Settings.remoteURL}/animalCaretakers?animalId=${animalId}&_expand=user`)
        return await e.json()
    },
    async assignEmployee(animalId, userId) {
        const e = await fetch(`${Settings.remoteURL}/animalCaretakers`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("kennel_token")}`
            },
            "body": JSON.stringify({ animalId, userId })
        })
        return await e.json()
    },

    async getAllCaretakers() {
        return await fetchIt(`${Settings.remoteURL}/users?employee=true`)
    },

    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/users?employee=true&_embed=employeeLocations&_embed=animalCaretakers`)
    },
    async assignLocation(rel) {
        return await fetchIt(`${Settings.remoteURL}/employeeLocations`, "POST", JSON.stringify(rel))
    },
    async getEmployeeLocations() {
        return await fetchIt(`${Settings.remoteURL}/employeeLocations`)
    }
}
