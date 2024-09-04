import { AxiosResponse } from "axios"
import { IAccessLevel } from "../types/accessLevel.types"
import useApiClient from "../hooks/ApiClient"


const fetchAccessLevels = async (): Promise<AxiosResponse<{ results: IAccessLevel[] }>> => {
    return await useApiClient._get('/access-level?limit=100')
}

export {
    fetchAccessLevels
}