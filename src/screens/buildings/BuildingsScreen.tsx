import { Button } from "react-bootstrap"
import Breadcrumb from "../../components/Breadcrumb"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import BuildingCard from "../../components/BuildingCard"
import useApiClient from "../../hooks/ApiClient"
import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/AuthProvider"
import { LinkContainer } from "react-router-bootstrap"

const BuildingsScreen = () => {
    const auth = useAuth()
    const [buildings, setBuildings] = useState<{ name: string, _id: string, address: string, company: { name: string }[] }[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const response = await useApiClient._getWithToken('/building', auth.accessToken)
            // console.log(response.data)
            setBuildings(response.data)
            setIsLoading(false)
        }
        fetchData()
    }, [auth])

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
                    {/* <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Building Name</th>
                                            <th>Owner Company</th>
                                            <th>Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="icon-container">
                                                    <img src="svg/building.svg" alt="">
                                                </div>
                                            </td>
                                            <td>
                                                Ajantha Towers
                                            </td>
                                            <td>PaceWisdom Solutions</td>
                                            <td>Bejai, Mangalore</td>
                                            <td>
                                                <div>
                                                    <button type="button" className="btn edit-btn">
                                                        <img src="svg/edit.svg" alt="">
                                                            Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>  */}
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