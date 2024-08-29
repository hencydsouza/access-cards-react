import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/AuthProvider"
import useApiClient from "../../hooks/ApiClient"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"
import AccessCard from "../../components/AccessCard"

const AccessCardsScreen = () => {
  const auth = useAuth()
  const [accessCards, setAccessCards] = useState<{ cardHolder: { buildingId: string, companyId: string, employeeId: string }, cardNumber: string, id: string, is_active: boolean, issued_at: string, valid_until: string | null }[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    const fetchData = async () => {
      try {
        const response = await useApiClient._getWithToken('/access-card?limit=100', auth.accessToken)
        setAccessCards(response.data.results)
      } catch (error) {
        console.error('Error fetching access levels:', error)
      }
    }

    const loadData = async () => {
      await Promise.all([fetchData(), fetchCompanyNames(), fetchBuildingNames(), fetchEmployeeNames()])
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
              <Breadcrumb active text="Access Cards" />
            </BreadcrumbContainer>
            <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View all access cards</p>
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
              accessCards.map((data) => {
                return <AccessCard state={data} key={data.id} companyNames={companyNames} buildingNames={buildingNames} employeeNames={employeeNames} />
              })
            }
          </div>
        </div>
      </div>
    ) : (<div className="text-center font-semibold">Loading...</div>)
  )
}

export default AccessCardsScreen