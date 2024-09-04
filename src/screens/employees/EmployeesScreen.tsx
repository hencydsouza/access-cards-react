import { useEffect, useState } from "react"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"
import EmployeeCard from "../../components/EmployeeCard"
import { IEmployee } from "../../types/employees.types"
import { useFetchBuildingNames, useFetchCompanyNames, useFetchEmployees } from "../../hooks/useFetchQueries"

const EmployeesScreen = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([])
    const [companyNames, setCompanyNames] = useState<{ name: string, _id: string }[]>([{
        name: "name",
        _id: "_id"
    }])
    const [buildingNames, setBuildingNames] = useState<{ name: string, id: string }[]>([{
        name: "name",
        id: "id"
    }])

    const [isLoading, setIsLoading] = useState(true)

    const { data: employeeData, status: employeeStatus } = useFetchEmployees()
    const { data: companyNamesData, status: companyNamesStatus } = useFetchCompanyNames()
    const { data: buildingNamesData, status: buildingNamesStatus } = useFetchBuildingNames()

    useEffect(() => {
        if (employeeStatus === 'success' && companyNamesStatus === 'success' && buildingNamesStatus === 'success') {
            setEmployees(employeeData)
            setCompanyNames(companyNamesData)
            setBuildingNames(buildingNamesData)
            setIsLoading(false)
        }
    }, [employeeStatus, companyNamesStatus, buildingNamesStatus, employeeData, companyNamesData, buildingNamesData])

    return (
        !isLoading ? (
            <div>
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb active text="Employees" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View all employees</p>
                    </div>

                    <LinkContainer to="add">
                        <Button variant="primary" type="submit" className="flex  items-center justify-center gap-2">
                            <i className="fa-solid fa-plus"></i>
                            Add
                        </Button>
                    </LinkContainer>
                </div>

                <div>
                    <div className="lg:flex flex-col mt-8 hidden">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="border-[#e8f1fd] border-1 rounded-lg overflow-hidden shadow-sm">
                                    <table className="min-w-full divide-y">
                                        <thead className="bg-[#e8f1fd] text-[#0b3f7f] font-medium">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-start text-xs">Employee Name</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs">Company</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs">Building</th>
                                                <th scope="col" className="px-6 py-3 text-end text-xs">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y bg-white">
                                            {
                                                employees.map((data) => {
                                                    return (
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{data.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{companyNames.find((item) => item._id == data.company.companyId)?.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{buildingNames.find((item) => item.id == data.company.buildingId)?.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                                <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold">
                                                                    <LinkContainer to={`/dashboard/employees/${data.id}`} state={data}>
                                                                        <Button variant="outline-primary" className="w-max flex items-center gap-2 mt-auto">
                                                                            <i className="fa-regular fa-eye"></i>
                                                                        </Button>
                                                                    </LinkContainer>
                                                                    <LinkContainer to={`/dashboard/employees/edit/${data.id}`} state={data}>
                                                                        <Button variant="outline-primary" className="w-max flex items-center gap-2 mt-auto">
                                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                                        </Button>
                                                                    </LinkContainer>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gap-3 mt-8 grid lg:grid-cols-2 xl:grid-cols-3 lg:hidden">
                        {
                            employees.map((data) => {
                                return <EmployeeCard state={data} companyNames={companyNames} key={data.id} />
                            })
                        }
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default EmployeesScreen