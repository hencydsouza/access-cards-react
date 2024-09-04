import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/AuthProvider"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"
import { useFetchAccessLogs, useFetchBuildingNames, useFetchCompanyNames, useFetchEmployeeNames } from "../../hooks/useFetchQueries"
import { IBuildingNames, ICompanyNames, IEmployeeNames } from "../../types/form.types"
import { IAccessLogs } from "../../types/accessLogs.types"

const AccessLogsScreen = () => {
    const auth = useAuth()
    const [accessLogs, setAccessLogs] = useState<IAccessLogs[]>([])
    const [companyNames, setCompanyNames] = useState<Partial<ICompanyNames>[]>([])
    const [buildingNames, setBuildingNames] = useState<IBuildingNames[]>([])
    const [employeeNames, setEmployeeNames] = useState<IEmployeeNames[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<number>(10)

    const { data: companyNamesData, status: companyNamesStatus } = useFetchCompanyNames()
    const { data: buildingNamesData, status: buildingNamesStatus } = useFetchBuildingNames()
    const { data: employeeNamesData, status: employeeNamesStatus } = useFetchEmployeeNames()
    const { data, status } = useFetchAccessLogs(page, limit)

    useEffect(() => {
        if (status === 'success') {
            setAccessLogs(data)
            setIsLoading(false)
        }
    }, [auth, page, limit, status, data])

    useEffect(() => {
        if (companyNamesStatus === 'success' && buildingNamesStatus === 'success' && employeeNamesStatus === 'success') {
            setCompanyNames(companyNamesData)
            setBuildingNames(buildingNamesData)
            setEmployeeNames(employeeNamesData)
        }
    }, [companyNamesData, buildingNamesData, employeeNamesData, companyNamesStatus, buildingNamesStatus, employeeNamesStatus])

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