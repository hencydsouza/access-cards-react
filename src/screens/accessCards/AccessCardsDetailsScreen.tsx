import { useLocation, useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"

const AccessCardsDetailsScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const location = useLocation()
    const [accessCards, setAccessCards] = useState<{ cardHolder: { buildingId: string, companyId: string, employeeId: string }, cardNumber: string, id: string, is_active: boolean, issued_at: string, valid_until: string | null }>(location.state)
    const [companyNames, setCompanyNames] = useState<{ name: string, _id: string }[]>([{
        name: "name",
        _id: "_id"
    }])
    const [buildingNames, setBuildingNames] = useState<{ name: string, id: string }[]>([{
        name: "",
        id: ""
    }])
    const [employeeNames, setEmployeeNames] = useState<{ name: string, id: string }[]>([{
        name: "name",
        id: "id"
    }])

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useApiClient._getWithToken(`/access-card/${params.id}`, auth.accessToken)
                console.log(response.data)
                setAccessCards(response.data)
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
        const fetchEmployeeNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/employee/employeeNames', auth.accessToken)
                //   console.log(response.data)
                setEmployeeNames(response.data)
            } catch (error) {
                console.error('Error fetching company names:', error)
            }
        }

        const fetchAllData = async () => {
            setIsLoading(true)
            await Promise.all([
                fetchData(),
                fetchCompanyNames(),
                fetchBuildingNames(),
                fetchEmployeeNames()
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
                            <Breadcrumb link="/dashboard/access-cards" text="Access Cards" />
                            <Breadcrumb active text={accessCards.cardNumber} />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View access card details</p>
                    </div>

                    <LinkContainer to={`/dashboard/access-cards/edit/${accessCards.id}`} state={accessCards}>
                        <Button variant="primary" type="submit" className="flex  items-center justify-center gap-2">
                            <i className="fa-regular fa-pen-to-square"></i>
                            Edit
                        </Button>
                    </LinkContainer>
                </div>

                <div>
                    <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8 flex flex-col gap-[1rem] md:gap-[1.5rem] relative">
                        <span className="absolute right-[2rem] flex h-3 w-3 md:hidden">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accessCards.is_active ? "bg-[#268e6c]" : "bg-[#d7373f]"} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${accessCards.is_active ? "bg-[#268e6c]" : "bg-[#d7373f]"}`}></span>
                        </span>
                        <div className="flex justify-between">
                            <div className="grid md:grid-cols-2 gap-[1rem] md:gap-[1.5rem] flex-grow-1">
                                <div>
                                    <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Card Number</p>
                                    <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{accessCards.cardNumber}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Employee Name</p>
                                    <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{employeeNames.find((item) => item.id === accessCards.cardHolder.employeeId)?.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Company</p>
                                    <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{companyNames.find((item) => item._id === accessCards.cardHolder.companyId)?.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Building</p>
                                    <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{buildingNames.find((item) => item.id === accessCards.cardHolder.buildingId)?.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Issued On</p>
                                    <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem] text-[#4b4b4b]">{accessCards.issued_at.split('T')[0]}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#b3b3b3]">Valid Until</p>
                                    <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem] text-[#4b4b4b]">{accessCards.valid_until ? accessCards.valid_until.split('T')[0] : 'Not Set'}</p>
                                </div>
                            </div>

                            <div className="font-bold text-0.8rem md:text-[1.5rem] hidden md:block">{accessCards.is_active ? <div className="text-[#268e6c]">ACTIVE</div> : <div className="text-[#d7373f]">INACTIVE</div>}</div>
                        </div>

                        {/* <div>
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
                        </div> */}
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default AccessCardsDetailsScreen