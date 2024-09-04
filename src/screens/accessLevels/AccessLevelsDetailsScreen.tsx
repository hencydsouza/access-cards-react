import { useLocation, useParams } from "react-router"
import { useEffect, useState } from "react"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"
import { IAccessLevel } from "../../types/accessLevel.types"
import { useFetchAccessLevelById } from "../../hooks/useFetchQueries"

const AccessLevelsDetailsScreen = () => {
    const params = useParams()
    const location = useLocation()
    const [accessLevels, setAccessLevels] = useState<IAccessLevel>(location.state)
    const [isLoading, setIsLoading] = useState(true)

    const { data, status } = useFetchAccessLevelById(params.id!)

    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const response = await useApiClient._getWithToken(`/access-level/${params.id}`, auth.accessToken)
        //         console.log(response.data)
        //         setAccessLevels(response.data)
        //         setIsLoading(false)
        //     } catch (error) {
        //         console.error("Error fetching access level:", error)
        //         setIsLoading(false)
        //     }
        // }
        // fetchData()

        if (status === "success") {
            setAccessLevels(data)
            console.log(data)
            setIsLoading(false)
        }
    }, [status, data])

    return (
        !isLoading ? (
            <div>
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb link="/dashboard/access-levels" text="Access Levels" />
                            <Breadcrumb active text={accessLevels.name} />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View access level</p>
                    </div>

                    <LinkContainer to={`/dashboard/access-levels/edit/${accessLevels.id}`} state={accessLevels}>
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
                            <p className="font-bold lg:text-[1.4rem] md:text-[1.2rem] text-[1.1rem]">{accessLevels.name}</p>
                        </div>
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Type</p>
                            <p className="font-medium lg:text-[1.1rem] md:text-[0.9rem] text-[0.8rem] text-[#4b4b4b]">{accessLevels.type}</p>
                        </div>
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Description</p>
                            <p className="font-medium lg:text-[1.1rem] md:text-[0.9rem] text-[0.8rem] text-[#4b4b4b]">{accessLevels.description}</p>
                        </div>
                        <div>
                            <p className="font-medium text-[0.7rem] md:text-[0.8rem] lg:text-[1rem] text-[#0B3F7F]">Permissions</p>
                            <div className="relative overflow-x-auto sm:rounded-lg mt-2 border-2 border-[#e8f1fd] w-full md:w-max">
                                <table className="w-full md:w-auto text-sm text-left rtl:text-right">
                                    <thead className="text-xs bg-[#E8F1FD] text-[#0B3F7F]">
                                        <tr>
                                            <th scope="col" className="py-[0.813rem] px-[0.5rem] md:px-[2rem] lg:px-[4rem]">Resource</th>
                                            <th scope="col" className="py-[0.813rem] px-[0.5rem] md:px-[2rem] lg:px-[4rem]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accessLevels.permissions.map((permission, index) => (
                                            <tr key={index} className="text-black">
                                                <th scope="row" className="font-medium whitespace-nowrap py-[0.5rem] px-[0.5rem] md:px-[2rem] lg:px-[4rem] text-wrap md:text-nowrap">{permission.resource}</th>
                                                <td className="py-[0.5rem] px-[0.5rem] md:px-[2rem] lg:px-[4rem]">{permission.action}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default AccessLevelsDetailsScreen