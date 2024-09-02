import { AxiosResponse } from "axios";
import useApiClient from "../hooks/ApiClient";
import { ICompany, ICompanyOwnedBuildingsUpdate } from "../types/company.types";

const fetchCompanies = async (): Promise<AxiosResponse<{ results: ICompany[] }>> => {
    return await useApiClient._get('/company?limit=100')
}

const fetchCompanyById = async (id: string | undefined): Promise<AxiosResponse<ICompany>> => {
    return await useApiClient._get(`/company/${id}`)
}

const updateCompanyById = async (id: string, data: ICompanyOwnedBuildingsUpdate): Promise<AxiosResponse<ICompany>> => {
    return await useApiClient._patch(`/company/${id}`, data)
}

export {
    fetchCompanies,
    fetchCompanyById,
    updateCompanyById
}