import { AxiosResponse } from "axios";
import useApiClient from "../hooks/ApiClient";
import { ICompany, ICompanyCreate, ICompanyOwnedBuildingsUpdate } from "../types/company.types";

const fetchCompanies = async (): Promise<AxiosResponse<{ results: ICompany[] }>> => {
    return await useApiClient._get('/company?limit=100')
}

const fetchCompanyById = async (id: string | undefined): Promise<AxiosResponse<ICompany>> => {
    return await useApiClient._get(`/company/${id}`)
}

// name: input.name, buildingId: input.buildingId, ownedBuildings: input.ownedBuildings

const addCompany = async (data: ICompanyCreate): Promise<AxiosResponse<ICompany>> => {
    return await useApiClient._post('/company', data)
}

const updateCompanyOwnedBuildingsById = async (id: string, data: ICompanyOwnedBuildingsUpdate): Promise<AxiosResponse<ICompany>> => {
    return await useApiClient._patch(`/company/${id}`, data)
}

const updateCompanyById = async (id: string, data: {
    name: string;
    buildingId: string;
    ownedBuildings: { buildingId: string }[]
}): Promise<AxiosResponse<ICompany>> => {
    return await useApiClient._patch(`/company/${id}`, data)
}

const deleteCompanyById = async (id: string): Promise<AxiosResponse<ICompany>> => {
    return await useApiClient._delete(`/company/${id}`)
}

export {
    fetchCompanies,
    fetchCompanyById,
    addCompany,
    updateCompanyById,
    updateCompanyOwnedBuildingsById,
    deleteCompanyById
}