import { AxiosResponse } from "axios"
import useApiClient from "../hooks/ApiClient"
import { IAccessLogs } from "../types/accessLogs.types"

const fetchAccessLog = async (page: number, limit: number): Promise<AxiosResponse<IAccessLogs[]>> => {
    return await useApiClient._get(`/access-log?limit=${limit}&page=${page}`)
}

export {
    fetchAccessLog
}