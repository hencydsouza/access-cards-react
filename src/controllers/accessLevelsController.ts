import { AxiosResponse } from "axios"
import { IAccessLevel, IAccessLevelCreate } from "../types/accessLevel.types"
import useApiClient from "../hooks/ApiClient"


const fetchAccessLevels = async (): Promise<AxiosResponse<{ results: IAccessLevel[] }>> => {
    return await useApiClient._get('/access-level?limit=100')
}

const fetchAccessLevelById = async (id: string): Promise<AxiosResponse<IAccessLevel>> => {
    return await useApiClient._get(`/access-level/${id}`)
}

const addAccessLevel = async (accessLevel: IAccessLevelCreate): Promise<AxiosResponse<IAccessLevel>> => {
    return await useApiClient._post('/access-level', accessLevel)
}

export {
    fetchAccessLevels,
    fetchAccessLevelById,
    addAccessLevel
}