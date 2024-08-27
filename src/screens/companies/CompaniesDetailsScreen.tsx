import { useLocation, useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"

const CompaniesDetailsScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const location = useLocation()
    const [company, setCompany] = useState<{ name: string, id: string, buildings: { buildingName: string }, ownedBuildings: { buildingName: string; }[] }>(location.state)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const response = await useApiClient._getWithToken(`/company/${params.id}`, auth.accessToken)
            // console.log(response.data)
            setCompany(response.data)
            setIsLoading(false)
        }
        fetchData()
    }, [auth, params.id])

    return (
        !isLoading ? (
            <div>
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb link="/dashboard/companies" text="Companies" />
                            <Breadcrumb active text={company.name} />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View company details</p>
                    </div>

                    <LinkContainer to={`/dashboard/companies/edit/${company.id}`} state={company}>
                        <Button variant="primary" type="submit" className="flex  items-center justify-center gap-2">
                            <i className="fa-regular fa-pen-to-square"></i>
                            Edit
                        </Button>
                    </LinkContainer>
                </div>

                <div>
                    <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8 flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Name</p>
                            <p className="font-bold lg:text-[1.6rem] md:text-[1.4rem] text-[1.3rem]">{company.name}</p>
                        </div>
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Located in</p>
                            <p className="font-medium lg:text-[1.3rem] md:text-[1.1rem] text-[1rem] text-[#4b4b4b]">{company.buildings.buildingName}</p>
                        </div>
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Owned Buildings</p>
                            <p className="font-medium lg:text-[1.3rem] md:text-[1.1rem] text-[1rem] text-[#4b4b4b]">{company.ownedBuildings.reduce((str, item) => { return str.length == 0 ? str + item.buildingName : str + ", " + item.buildingName }, "")}</p>
                        </div>
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default CompaniesDetailsScreen