import { useLocation, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"
import { useFetchCompanyById } from "../../hooks/useFetchQueries"
import { ICompany } from "../../types/company.types"
import { checkResource } from "../../helpers/checkResource"

const CompaniesDetailsScreen = (props: { resource: string[] }) => {
    const navigate = useNavigate()
    const params = useParams()
    const location = useLocation()
    const [company, setCompany] = useState<ICompany>(location.state)
    const [isLoading, setIsLoading] = useState(true)

    const { data, status } = useFetchCompanyById(params.id)

    useEffect(() => {
        if (!checkResource(props.resource)) {
            navigate('/dashboard')
        }

        if (status === 'success') {
            setCompany(data)
            setIsLoading(false)
        }
    }, [params.id, data, status, navigate, props.resource])

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
                            <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{company.name}</p>
                        </div>
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Located in</p>
                            <p className="font-medium lg:text-[1.1rem] md:text-[0.9rem] text-[0.8rem] text-[#4b4b4b]">{company.buildings.buildingName}</p>
                        </div>
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Owned Buildings</p>
                            <p className="font-medium lg:text-[1.1rem] md:text-[0.9rem] text-[0.8rem] text-[#4b4b4b]">{company.ownedBuildings.reduce((str, item) => { return str.length == 0 ? str + item.buildingName : str + ", " + item.buildingName }, "") || "none"}</p>
                        </div>
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default CompaniesDetailsScreen