import { Button } from "react-bootstrap"
import Breadcrumb from "../../components/Breadcrumb"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
// import BuildingCard from "../../components/BuildingCard"
import { useEffect, useState } from "react"
import { LinkContainer } from "react-router-bootstrap"
import CompanyCard from "../../components/CompanyCard"
import { useFetchCompanies } from "../../hooks/useFetchQueries"
import { ICompany } from "../../types/company.types"
import { useNavigate } from "react-router"
import { checkResource, getResource } from "../../helpers/checkResource"
import { useAuth } from "../../hooks/AuthProvider"

const CompaniesScreen = (props: { resource: string[] }) => {
    const auth = useAuth()
    const navigate = useNavigate()

    const [companies, setCompanies] = useState<ICompany[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const { data, status } = useFetchCompanies()

    useEffect(() => {
        if (getResource() === 'company') {
            navigate(`/dashboard/companies/${auth.user?.company.companyId}`)
        } else if (!checkResource(props.resource)) {
            navigate('/dashboard')
        }
        
        if (status === 'success') {
            setCompanies(data)
            setIsLoading(false)
            // console.log(data)
        }
    }, [status, data, auth, navigate, props.resource])

    return (
        !isLoading ? (
            <div>
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb active text="Companies" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View all companies</p>
                    </div>

                    <LinkContainer to="add">
                        <Button variant="primary" type="submit" className="flex  items-center justify-center gap-2">
                            <i className="fa-solid fa-plus"></i>
                            Add
                        </Button>
                    </LinkContainer>
                </div>

                <div>
                    <div className="gap-3 mt-8 grid lg:grid-cols-2 xl:grid-cols-3">
                        {
                            companies.map((companyData) => {
                                return <CompanyCard state={companyData} key={companyData.id} />
                            })
                        }
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default CompaniesScreen