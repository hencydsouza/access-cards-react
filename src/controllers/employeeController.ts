import { AxiosResponse } from "axios"
import { IEmployee } from "../types/employees.types"
import useApiClient from "../hooks/ApiClient"

const fetchEmployees = async (): Promise<AxiosResponse<{ results: IEmployee[] }>> => {
    return await useApiClient._get('/employee?limit=100')
}

export {
    fetchEmployees
}