import { AxiosResponse } from "axios"
import { IEmployee, IEmployeeCreate } from "../types/employees.types"
import useApiClient from "../hooks/ApiClient"

const fetchEmployees = async (): Promise<AxiosResponse<{ results: IEmployee[] }>> => {
    return await useApiClient._get('/employee?limit=100')
}

const fetchEmployeeById = async (id: string): Promise<AxiosResponse<IEmployee>> => {
    return await useApiClient._get(`/employee/${id}`)
}

const addEmployee = async (data: IEmployeeCreate): Promise<AxiosResponse<IEmployee>> => {
    return await useApiClient._post('/employee', data)
}

const updateEmployee = async (id: string, data: IEmployeeCreate): Promise<AxiosResponse<IEmployee>> => {
    return await useApiClient._patch(`/employee/${id}`, data)
}

const deleteEmployee = async (id: string): Promise<AxiosResponse<IEmployee>> => {
    return await useApiClient._delete(`/employee/${id}`)
}

export {
    fetchEmployees,
    fetchEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
}