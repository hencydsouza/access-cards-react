import { fetchBuildingById, fetchBuildings, updateBuildingById } from "../controllers/buildingsController";
import { fetchDashboard } from "../controllers/dashboardController";
import { fetchCompanyNames } from "../controllers/formDataController";
import { IBuildings, IBuildingUpdate } from "../types/buildings.types";
import { IDashboard } from "../types/dashboard.types";
import { QueryObserverResult, UseBaseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICompanyNames } from "../types/form.types";
import { AxiosResponse } from "axios";

// Dashboard
const useFetchDashboard = (): QueryObserverResult<IDashboard> => {
    return useQuery<IDashboard>({
        queryFn: async () => {
            const { data } = await fetchDashboard()
            return data
        },
        queryKey: ['dashboard']
    })
}

// Buildings
const useFetchBuildings = (): QueryObserverResult<IBuildings[]> => {
    return useQuery<IBuildings[]>({
        queryFn: async () => {
            const { data } = await fetchBuildings()
            return data
        },
        queryKey: ['buildings']
    })
}

const useFetchBuildingById = (id: string | undefined): QueryObserverResult<IBuildings[]> => {
    return useQuery<IBuildings[]>({
        queryFn: async () => {
            const { data } = await fetchBuildingById(id)
            return data
        },
        queryKey: ['buildings', id]
    })
}

const useUpdateBuildingById = (id: string | undefined): UseBaseMutationResult<AxiosResponse<IBuildingUpdate>, unknown, IBuildingUpdate, unknown> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: IBuildingUpdate) => updateBuildingById(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buildings'] })
        }
    })
}

// Form Data
const useFetchCompanyNames = (): QueryObserverResult<ICompanyNames[]> => {
    return useQuery<ICompanyNames[]>({
        queryFn: async () => {
            const { data } = await fetchCompanyNames()
            return data
        },
        queryKey: ['companyNames']
    })
}

export {
    useFetchDashboard,
    useFetchBuildings,
    useFetchBuildingById,
    useFetchCompanyNames,
    useUpdateBuildingById
}