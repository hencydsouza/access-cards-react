import { fetchBuildingById, fetchBuildings, updateBuildingById } from "../controllers/buildingsController";
import { fetchDashboard } from "../controllers/dashboardController";
import { fetchAccessLevelNames, fetchBuildingNames, fetchCompanyNames } from "../controllers/formDataController";
import { IBuildings, IBuildingUpdate } from "../types/buildings.types";
import { IDashboard } from "../types/dashboard.types";
import { QueryObserverResult, UseBaseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IAccessLevelNames, IBuildingNames, ICompanyNames } from "../types/form.types";
import { AxiosResponse } from "axios";
import { ICompany } from "../types/company.types";
import { fetchCompanies, fetchCompanyById } from "../controllers/companyController";
import { IEmployee } from "../types/employees.types";
import { fetchEmployeeById, fetchEmployees } from "../controllers/employeeController";

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

// Companies
const useFetchCompanies = (): QueryObserverResult<ICompany[]> => {
    return useQuery<ICompany[]>({
        queryFn: async () => {
            const { data } = await fetchCompanies()
            return data.results
        },
        queryKey: ['companies']
    })
}

const useFetchCompanyById = (id: string | undefined): QueryObserverResult<ICompany> => {
    return useQuery<ICompany>({
        queryFn: async () => {
            const { data } = await fetchCompanyById(id)
            return data
        },
        queryKey: ['companies', id]
    })
}

// Employees
const useFetchEmployees = (): QueryObserverResult<IEmployee[]> => {
    return useQuery<IEmployee[]>({
        queryFn: async () => {
            const { data } = await fetchEmployees()
            return data.results
        },
        queryKey: ['employees']
    })
}

const useFetchEmployeeById = (id: string): QueryObserverResult<IEmployee> => {
    return useQuery<IEmployee>({
        queryFn: async () => {
            const { data } = await fetchEmployeeById(id)
            return data
        },
        queryKey: ['employees', id]
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

const useFetchBuildingNames = (): QueryObserverResult<IBuildingNames[]> => {
    return useQuery<IBuildingNames[]>({
        queryFn: async () => {
            const { data } = await fetchBuildingNames()
            return data
        },
        queryKey: ['buildingNames']
    })
}

const useFetchAccessLevelNames = (): QueryObserverResult<IAccessLevelNames[]> => {
    return useQuery<IAccessLevelNames[]>({
        queryFn: async () => {
            const { data } = await fetchAccessLevelNames()
            return data
        },
        queryKey: ['accessLevelNames']
    })
}

export {
    useFetchDashboard,
    useFetchBuildings,
    useFetchBuildingById,
    useFetchCompanies,
    useFetchCompanyById,
    useFetchCompanyNames,
    useFetchBuildingNames,
    useUpdateBuildingById,
    useFetchEmployees,
    useFetchEmployeeById,
    useFetchAccessLevelNames
}