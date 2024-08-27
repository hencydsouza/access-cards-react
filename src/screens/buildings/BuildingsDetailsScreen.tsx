import { useEffect, useState } from "react"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button } from "react-bootstrap"
import { useLocation, useParams } from "react-router"
import { LinkContainer } from "react-router-bootstrap"
import useApiClient from "../../hooks/ApiClient"
import { useAuth } from "../../hooks/AuthProvider"

const BuildingsDetailsScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const location = useLocation()
    const [building, setBuilding] = useState<{ name: string, _id: string, address: string, company: { name: string }[] }>(location.state)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const response = await useApiClient._getWithToken(`/building/${params.id}`, auth.accessToken)
            // console.log(response.data[0])
            setBuilding(response.data[0])
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
                            <Breadcrumb link="/dashboard/buildings" text="Buildings" />
                            <Breadcrumb active text={building.name} />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View building details</p>
                    </div>

                    <LinkContainer to={`/dashboard/buildings/edit/${building._id}`} state={building}>
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
                            <p className="font-bold lg:text-[1.6rem] md:text-[1.4rem] text-[1.3rem]">{building.name}</p>
                        </div>
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Owned By</p>
                            <p className="font-medium lg:text-[1.3rem] md:text-[1.1rem] text-[1rem] text-[#4b4b4b]">{building.company[0] ? building.company[0].name : "Not owned"}</p>
                        </div>
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Location</p>
                            <p className="font-medium lg:text-[1.3rem] md:text-[1.1rem] text-[1rem] text-[#4b4b4b]">{building.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default BuildingsDetailsScreen