import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/AuthProvider"
import useApiClient from "../../hooks/ApiClient"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"
import EmployeeCard from "../../components/EmployeeCard"

const EmployeesScreen = () => {
    const auth = useAuth()
    const [employees, setEmployees] = useState<{ name: string, id: string, email: string, company: { buildingId: string, companyId: string }, permissions: { resource: string, action: string, type: string }[], accessLevels: { accessLevel: string }[] }[]>([])
    const [companyNames, setCompanyNames] = useState<{ name: string, _id: string }[]>([{
        name: "name",
        _id: "_id"
    }])

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useApiClient._getWithToken('/employee?limit=100', auth.accessToken)
                setEmployees(response.data.results)
            } catch (error) {
                console.error('Error fetching employees:', error)
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

        const loadData = async () => {
            setIsLoading(true)
            await Promise.all([fetchData(), fetchCompanyNames()])
            setIsLoading(false)
        }

        loadData()
    }, [auth])

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
                    {/* <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Building Name</th>
                                            <th>Owner Company</th>
                                            <th>Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="icon-container">
                                                    <img src="svg/building.svg" alt="">
                                                </div>
                                            </td>
                                            <td>
                                                Ajantha Towers
                                            </td>
                                            <td>PaceWisdom Solutions</td>
                                            <td>Bejai, Mangalore</td>
                                            <td>
                                                <div>
                                                    <button type="button" className="btn edit-btn">
                                                        <img src="svg/edit.svg" alt="">
                                                            Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>  */}
                    <div className="gap-3 mt-8 grid lg:grid-cols-2 xl:grid-cols-3">
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