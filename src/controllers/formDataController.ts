import { AxiosResponse } from "axios";
import { IAccessLevelNames, IBuildingNames, ICompanyNames, IEmployeeNames } from "../types/form.types";
import useApiClient from "../hooks/ApiClient";

const fetchCompanyNames = async (): Promise<AxiosResponse<ICompanyNames[]>> => {
    return useApiClient._get('/company/companyNames')
}

const fetchBuildingNames = async (): Promise<AxiosResponse<IBuildingNames[]>> => {
    return useApiClient._get('/building/buildingNames')
}

const fetchAccessLevelNames = async (): Promise<AxiosResponse<IAccessLevelNames[]>> => {
    return useApiClient._get('/access-level/accessLevelNames')
}

const fetchEmployeeNames = async (): Promise<AxiosResponse<IEmployeeNames[]>> => {
    return useApiClient._get('/employee/employeeNames')
}

export {
    fetchCompanyNames,
    fetchBuildingNames,
    fetchAccessLevelNames,
    fetchEmployeeNames
}