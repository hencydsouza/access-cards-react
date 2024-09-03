import { Button } from "react-bootstrap"
import Breadcrumb from "../../components/Breadcrumb"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import BuildingCard from "../../components/BuildingCard"
import { useEffect, useState } from "react"
import { LinkContainer } from "react-router-bootstrap"
import { useFetchBuildings } from "../../hooks/useFetchQueries"
import { IBuildings } from "../../types/buildings.types"
import { checkResource, getResource } from "../../helpers/checkResource"
import { useNavigate } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"

const BuildingsScreen = (props: { resource: string[] }) => {
    const auth = useAuth()
    const navigate = useNavigate()

    const [buildings, setBuildings] = useState<IBuildings[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const { data, status } = useFetchBuildings()

    useEffect(() => {
        if (getResource() === 'building') {
            navigate(`/dashboard/buildings/${auth.user?.company.buildingId}`)
        } else if (!checkResource(props.resource)) {
            navigate('/dashboard')
        }

        if (status === 'success') {
            setBuildings(data)
            setIsLoading(false)
        }
    }, [status, data, auth, navigate, props.resource])

    return (
        !isLoading ? (
            <div>
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb active text="Buildings" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View all buildings</p>
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
                            buildings.map((data) => {
                                return <BuildingCard state={data} key={data._id} />
                            })
                        }
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default BuildingsScreen