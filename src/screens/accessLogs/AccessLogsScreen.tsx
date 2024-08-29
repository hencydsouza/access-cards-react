import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/AuthProvider"
import useApiClient from "../../hooks/ApiClient"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"

const AccessLogsScreen = () => {
    const auth = useAuth()
    const [accessLogs, setAccessLogs] = useState<{ accessCardId: string, accessType: string, bucketEndTime: string, bucketStartTime: string, buildingId: string, companyId: string, employeeId: string, eventType: string, timestamp: string, resource: string[], _id: string }[]>([
        {
            accessCardId: "accessCardId",
            accessType: "accessType",
            bucketEndTime: "bucketEndTime",
            bucketStartTime: "bucketStartTime",
            buildingId: "buildingId",
            companyId: "companyId",
            employeeId: "employeeId",
            eventType: "eventType",
            timestamp: "timestamp",
            resource: ["resource"],
            _id: "_id"
        }
    ])
    const [companyNames, setCompanyNames] = useState<{ name: string, _id: string }[]>([{
        name: "name",
        _id: "_id"
    }])
    const [buildingNames, setBuildingNames] = useState<{ name: string, id: string }[]>([{
        name: "name",
        id: "id"
    }])
    const [employeeNames, setEmployeeNames] = useState<{ name: string, id: string }[]>([{
        name: "name",
        id: "id"
    }])

    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<number>(10)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useApiClient._getWithToken(`/access-log?limit=${limit}&page=${page}`, auth.accessToken)
                setAccessLogs(response.data)
            } catch (error) {
                console.error('Error fetching employees:', error)
            }
        }

        const loadData = async () => {
            // setIsLoading(true)
            await fetchData()
            setIsLoading(false)
        }

        loadData()
    }, [auth, page, limit])

    useEffect(() => {
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
                console.log(response.data)
                setBuildingNames(response.data)
            } catch (error) {
                console.error('Error fetching company names:', error)
            }
        }
        const fetchEmployeeNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/employee/employeeNames', auth.accessToken)
                console.log(response.data)
                setEmployeeNames(response.data)
            } catch (error) {
                console.error('Error fetching company names:', error)
            }
        }

        const loadStaticData = async () => {
            await Promise.all([fetchCompanyNames(), fetchBuildingNames(), fetchEmployeeNames()])
        }

        loadStaticData()
    }, [auth])

    return (
        !isLoading ? (
            <div>
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb active text="Access Logs" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View all access logs</p>
                    </div>
                </div>

                <div>
                    {/* <div className="mt-4">
                        <p>Filters</p>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                            <Form.Select aria-label="Default select example">
                                <option>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                            <Form.Select aria-label="Default select example">
                                <option>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                            <Form.Select aria-label="Default select example">
                                <option>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                            <Form.Select aria-label="Default select example">
                                <option>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </div>
                    </div> */}

                    <div className="lg:flex flex-col mt-4">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="border-[#e8f1fd] border-1 rounded-lg overflow-hidden shadow-sm sm:justify-center">
                                    <table className="min-w-full divide-y">
                                        <thead className="bg-[#e8f1fd] text-[#0b3f7f] font-medium">
                                            <tr className="">
                                                <th scope="col" className="px-3 lg:px-6 py-2 text-start text-xs hidden lg:table-cell">Employee Name</th>
                                                <th scope="col" className="px-3 lg:px-6 py-2 text-start text-xs hidden lg:table-cell">Company</th>
                                                <th scope="col" className="px-3 lg:px-6 py-2 text-start text-xs hidden lg:table-cell">Building</th>
                                                <th scope="col" className="px-3 lg:px-6 py-2 text-start text-xs hidden lg:table-cell">Timestamp</th>
                                                <p className="px-3 lg:px-6 py-2 lg:hidden text-sm font-bold">Logs Table</p>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-[0.2rem] lg:divide-y bg-white">
                                            {
                                                accessLogs.map((data) => {
                                                    return (
                                                        <tr className="flex flex-col lg:table-row">
                                                            <td className="px-3 lg:px-6 py-2 whitespace-nowrap text-sm font-medium">
                                                                <p className="text-[#0b3f7f] text-[0.6rem] lg:hidden">Employee Name</p>
                                                                {employeeNames.find((item) => item.id == data.employeeId)?.name}
                                                            </td>
                                                            <td className="px-3 lg:px-6 py-2 whitespace-nowrap text-sm">
                                                                <p className="text-[#0b3f7f] text-[0.6rem] lg:hidden">Company Name</p>
                                                                {companyNames.find((item) => item._id == data.companyId)?.name || "Not Found"}
                                                            </td>
                                                            <td className="px-3 lg:px-6 py-2 whitespace-nowrap text-sm">
                                                                <p className="text-[#0b3f7f] text-[0.6rem] lg:hidden">Building Name</p>
                                                                {buildingNames.find((item) => item.id == data.buildingId)?.name}
                                                            </td>
                                                            <td className="px-3 lg:px-6 py-2 whitespace-nowrap text-sm">
                                                                <p className="text-[#0b3f7f] text-[0.6rem] lg:hidden">Timestamp</p>
                                                                {data.timestamp}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            <tr className="flex justify-between lg:table-row">
                                                <td className="px-3 lg:px-6 py-2 whitespace-nowrap text-sm flex  items-center gap-2 justify-end lg:justify-start">
                                                    <Button variant="outline-primary" onClick={() => {
                                                        if (page - 1 >= 1)
                                                            setPage(page - 1)
                                                    }}>
                                                        <i className="fa-solid fa-chevron-left"></i>
                                                    </Button>
                                                    {page}
                                                    <Button variant="outline-primary" onClick={() => {
                                                        if (accessLogs.length == limit)
                                                            setPage(page + 1)
                                                    }}>
                                                        <i className="fa-solid fa-chevron-right"></i>
                                                    </Button>
                                                </td>
                                                <td className="px-3 lg:px-6 py-2 whitespace-nowrap text-sm hidden lg:table-cell"></td>
                                                <td className="px-3 lg:px-6 py-2 whitespace-nowrap text-sm hidden lg:table-cell"></td>
                                                <td className="px-3 lg:px-6 py-2 whitespace-nowrap text-sm flex items-center gap-2 justify-start">
                                                    <p className="hidden lg:block">Logs per page</p>
                                                    <Form.Select defaultValue={limit} onChange={(event) => {
                                                        setPage(1)
                                                        setLimit(parseInt(event.target.value))
                                                    }} aria-label="Default select example">
                                                        <option value="5">5</option>
                                                        <option value="10">10</option>
                                                        <option value="20">20</option>
                                                        <option value="50">50</option>
                                                        <option value="100">100</option>
                                                    </Form.Select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default AccessLogsScreen