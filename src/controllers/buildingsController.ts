import { AxiosResponse } from "axios";
import { IBuildings, IBuildingInput } from "../types/buildings.types";
import useApiClient from "../hooks/ApiClient";

const fetchBuildings = async (): Promise<AxiosResponse<IBuildings[]>> => {
    return await useApiClient._get('/building')
}

const fetchBuildingById = async (id: string | undefined): Promise<AxiosResponse<IBuildings[]>> => {
    return await useApiClient._get(`/building/${id}`)
}

const updateBuildingById = async (id: string | undefined, data: IBuildingInput): Promise<AxiosResponse<IBuildingInput>> => {
    return await useApiClient._patch(`/building/${id}`, data)
}

const addBuilding = async (data: IBuildingInput): Promise<AxiosResponse<IBuildings>> => {
    return await useApiClient._post('/building', data)
}

const deleteBuildingById = async (id: string): Promise<AxiosResponse<IBuildings>> => {
    return await useApiClient._delete(`/building/${id}`)
}

export {
    fetchBuildings,
    fetchBuildingById,
    updateBuildingById,
    addBuilding,
    deleteBuildingById
}