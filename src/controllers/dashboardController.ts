import { AxiosResponse } from "axios"
import useApiClient from "../hooks/ApiClient"
import { IDashboard } from "../types/dashboard.types"

const fetchDashboard = async (): Promise<AxiosResponse<IDashboard>> => {
    return await useApiClient._get('/dashboard')
}

export {
    fetchDashboard
}