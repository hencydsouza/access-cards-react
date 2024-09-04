import { AxiosResponse } from "axios"
import useApiClient from "../hooks/ApiClient"
import { IAccessCards, IAccessCardsCreate, IAccessCardsUpdate } from "../types/accessCards.types"

const fetchAccessCards = async (): Promise<AxiosResponse<{ results: IAccessCards[] }>> => {
    return await useApiClient._get('/access-card?limit=100')
}

const fetchAccessCardById = async (id: string): Promise<AxiosResponse<IAccessCards>> => {
    return await useApiClient._get(`/access-card/${id}`)
}

const addAccessCard = async (data: { cardHolder: IAccessCardsCreate }): Promise<AxiosResponse<IAccessCards>> => {
    return await useApiClient._post('/access-card', data)
}

const updateAccessCard = async (id: string, data: IAccessCardsUpdate): Promise<AxiosResponse<IAccessCards>> => {
    return await useApiClient._patch(`/access-card/${id}`, data)
}

const deleteAccessCardById = async (id: string): Promise<AxiosResponse<IAccessCards>> => {
    return await useApiClient._delete(`/access-card/${id}`)
}

export {
    fetchAccessCards,
    fetchAccessCardById,
    addAccessCard,
    updateAccessCard,
    deleteAccessCardById
}