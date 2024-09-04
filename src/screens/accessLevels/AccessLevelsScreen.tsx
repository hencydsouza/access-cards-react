import { useEffect, useState } from "react"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"
import AccessLevelCard from "../../components/AccessLevelCard"
import { useFetchAccessLevels } from "../../hooks/useFetchQueries"

const AccessLevelsScreen = () => {
    const [accessLevels, setAccessLevels] = useState<{ name: string, type: string, id: string, description: string, permissions: { resource: string, action: string }[] | [] }[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const { data, status } = useFetchAccessLevels()

    useEffect(() => {
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
                            <Breadcrumb active text="Access Levels" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">View all access levels</p>
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
                            accessLevels.map((data) => {
                                return <AccessLevelCard state={data} key={data.id} />
                            })
                        }
                    </div>
                </div>
            </div>
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default AccessLevelsScreen