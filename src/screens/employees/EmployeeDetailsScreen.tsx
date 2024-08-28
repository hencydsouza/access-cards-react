import { useLocation, useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"

const EmployeeDetailsScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const location = useLocation()
    const [employee, setEmployee] = useState<{ name: string, id: string, email: string, company: { buildingId: string, companyId: string }, permissions: { resource: string, action: string, type: string }[], accessLevels: { accessLevel: string }[] }>(location.state)
    const [companyNames, setCompanyNames] = useState<{ name: string, _id: string }[]>([{
        name: "name",
        _id: "_id"
    }])
    const [buildingNames, setBuildingNames] = useState<{ name: string, id: string }[]>([{
        name: "",
        id: ""
    }])
    const [accessLevelNames, setAccessLevelNames] = useState<{ name: string, id: string }[]>([{
        name: "",
        id: ""
    }])

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useApiClient._getWithToken(`/employee/${params.id}`, auth.accessToken)
                console.log(response.data)
                setEmployee(response.data)
            } catch (error) {
                console.error('Error fetching employee data:', error)
            }
        }
        const fetchCompanyNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/company/companyNames', auth.accessToken)
                setCompanyNames(response.data)
            } catch (error) {
                console.error('Error fetching company names:', error)
            }
        }
        const fetchBuildingNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/building/buildingNames', auth.accessToken)
                setBuildingNames(response.data)
            } catch (error) {
                console.error('Error fetching building names:', error)
            }
        }
        const fetchAccessLevelNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/access-level/accessLevelNames', auth.accessToken)
                setAccessLevelNames(response.data)
            } catch (error) {
                console.error('Error fetching access level names:', error)
            }
        }

        const fetchAllData = async () => {
            setIsLoading(true)
            await Promise.all([
                fetchData(),
                fetchCompanyNames(),
                fetchBuildingNames(),
                fetchAccessLevelNames()
            ])
            setIsLoading(false)
        }

        fetchAllData()
    }, [auth, params.id])

    return (
        !isLoading ? (
            <div>
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb link="/dashboard/Employees" text="Employees" />
                            <Breadcrumb active text={employee.name} />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View employee details</p>
                    </div>

                    <LinkContainer to={`/dashboard/employees/edit/${employee.id}`} state={employee}>
                        <Button variant="primary" type="submit" className="flex  items-center justify-center gap-2">
                            <i className="fa-regular fa-pen-to-square"></i>
                            Edit
                        </Button>
                    </LinkContainer>
                </div>

                <div>
                    <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8 flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <div className="grid md:grid-cols-2 gap-[1rem] md:gap-[1.5rem]">
                            <div>
                                <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Name</p>
                                <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{employee.name}</p>
                            </div>
                            <div>
                                <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Email</p>
                                <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{employee.email}</p>
                            </div>
                            <div>
                                <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Company</p>
                                <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{companyNames.find((item) => item._id === employee.company.companyId)?.name}</p>
                            </div>
                            <div>
                                <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Building</p>
                                <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{buildingNames.find((item) => item.id === employee.company.buildingId)?.name}</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Access Levels</p>
                            <div className="flex flex-col gap-2 mt-2">
                                {
                                    employee.accessLevels.length
                                        ? employee.accessLevels.map((item, index) => (
                                            <p key={index} className="font-medium lg:text-[1rem] md:text-[0.8rem] text-[0.6rem] px-2 py-2 border bg-[#e8f1fd] text-[#0b3f7f] rounded-md sm:max-w-max">{accessLevelNames.find((name) => name.id === item.accessLevel)?.name}</p>
                                        ))
                                        : <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">none</p>
                                }
                            </div>
                        </div>

                        {/* TODO: Add Access card here */}

                        {/* <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Permissions</p>
                            <div className="relative overflow-x-auto sm:rounded-lg mt-2 border-2 border-[#e8f1fd] w-full md:w-max">
                                <table className="w-full md:w-auto text-sm text-left rtl:text-right">
                                    <thead className="text-xs bg-[#E8F1FD] text-[#0B3F7F]">
                                        <tr>
                                            <th scope="col" className="py-[0.813rem] px-[0.5rem] md:px-[2rem] lg:px-[4rem]">Resource</th>
                                            <th scope="col" className="py-[0.813rem] px-[0.5rem] md:px-[2rem] lg:px-[4rem]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accessLevels.permissions.map((permission, index) => (
                                            <tr key={index} className="text-black">
                                                <th scope="row" className="font-medium whitespace-nowrap py-[0.5rem] px-[0.5rem] md:px-[2rem] lg:px-[4rem] text-wrap md:text-nowrap">{permission.resource}</th>
                                                <td className="py-[0.5rem] px-[0.5rem] md:px-[2rem] lg:px-[4rem]">{permission.action}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default EmployeeDetailsScreen