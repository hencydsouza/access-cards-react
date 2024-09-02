import { AxiosResponse } from "axios";
import useApiClient from "../hooks/ApiClient";
import { ICompany, ICompanyOwnedBuildingsUpdate } from "../types/company.types";

const updateCompanyById = async (id: string, data: ICompanyOwnedBuildingsUpdate): Promise<AxiosResponse<ICompany>> => {
    return await useApiClient._patch(`/company/${id}`, data)
}

export {
    updateCompanyById
}