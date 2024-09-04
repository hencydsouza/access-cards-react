import { useEffect, useState } from "react"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"
import AccessCard from "../../components/AccessCard"
import { IAccessCards } from "../../types/accessCards.types"
import { useFetchAccessCards, useFetchBuildingNames, useFetchCompanyNames, useFetchEmployeeNames } from "../../hooks/useFetchQueries"
import { IBuildingNames, IEmployeeNames } from "../../types/form.types"

const AccessCardsScreen = () => {
  const [accessCards, setAccessCards] = useState<IAccessCards[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [companyNames, setCompanyNames] = useState<{ name: string, _id: string }[]>([])
  const [buildingNames, setBuildingNames] = useState<IBuildingNames[]>([])
  const [employeeNames, setEmployeeNames] = useState<IEmployeeNames[]>([])

  const { data: companyNamesData, status: companyNamesStatus } = useFetchCompanyNames()
  const { data: buildingNamesData, status: buildingNamesStatus } = useFetchBuildingNames()
  const { data: employeeNamesData, status: employeeNamesStatus } = useFetchEmployeeNames()
  const { data: accessCardsData, status: accessCardsStatus } = useFetchAccessCards()

  useEffect(() => {
    if (companyNamesStatus === "success" && buildingNamesStatus === "success" && employeeNamesStatus === "success" && accessCardsStatus === "success") {
      setCompanyNames(companyNamesData)
      setBuildingNames(buildingNamesData)
      setEmployeeNames(employeeNamesData)
      setAccessCards(accessCardsData)
      setIsLoading(false)
    }
  }, [
    companyNamesData,
    buildingNamesData,
    employeeNamesData,
    accessCardsData,
    companyNamesStatus,
    buildingNamesStatus,
    employeeNamesStatus,
    accessCardsStatus
  ])

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