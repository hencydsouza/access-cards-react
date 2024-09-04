import { AxiosResponse } from "axios"
import useApiClient from "../hooks/ApiClient"
import { IAccessCards } from "../types/accessCards.types"

const fetchAccessCards = async (): Promise<AxiosResponse<{ results: IAccessCards[] }>> => {
    return await useApiClient._get('/access-card?limit=100')
}

export {
    fetchAccessCards
}