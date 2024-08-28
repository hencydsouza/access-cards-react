/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router"

const CompaniesAddScreen = () => {
    const auth = useAuth()
    const navigate = useNavigate()
    // const [company, setCompany] = useState<{ name: string, id: string, buildings: { buildingName: string, buildingId: string }, ownedBuildings: { buildingName: string; }[] }>(useLocation().state)
    const [buildingNames, setBuildingNames] = useState<{ name: string, id: string }[]>([{
        name: "",
        id: ""
    }])
    const [isLoading, setIsLoading] = useState(true)

    const [input, setInput] = useState<{ name: string, buildingId: string, ownedBuildings: { buildingId: string }[] | [] }>({
        name: "",
        buildingId: "",
        ownedBuildings: []
    })

    useEffect(() => {
        const fetchBuildingNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/building/buildingNames', auth.accessToken)
                setBuildingNames(response.data)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching building names:', error)
                toast.error('Failed to fetch building names')
                setIsLoading(false)
            }
        }

        fetchBuildingNames()
    }, [auth])


    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        try {
            if (input.name.length > 0 && input.buildingId !== "none" && input.buildingId.length > 0 && input.ownedBuildings) {
                // console.log(input)
                if (input.ownedBuildings.length > 0) {
                    const result = await useApiClient._postWithToken(`/company`, { name: input.name, buildingId: input.buildingId, ownedBuildings: input.ownedBuildings }, auth.accessToken)
                    console.log(result.status)
                    toast.success('Company created successfully', { theme: "colored", position: "bottom-right" })
                    navigate(`/dashboard/companies/${result.data.id}`)
                } else {
                    const result = await useApiClient._postWithToken(`/company`, { name: input.name, buildingId: input.buildingId }, auth.accessToken)
                    console.log(result.status)
                    toast.success('Company created successfully', { theme: "colored", position: "bottom-right" })
                    navigate(`/dashboard/companies/${result.data.id}`)
                }
                return
            }
            toast.error("Please fill all the fields", { theme: "colored", position: "bottom-right" })
        } catch (error: any) {
            // console.log(error.response.data.code)
            toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
        }
    }

    const handleInput = (e: any) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOwnerBuildingInput = (e: any) => {
        const { name, value } = e.target
        setInput((prev: any) => ({
            ...prev,
            [name]: prev[name].some((building: { buildingId: string }) => building.buildingId === value)
                ? prev[name]
                : [
                    ...prev[name],
                    {
                        buildingId: value
                    }
                ]
        }))
        e.target.value = "none"
        // console.log(input)
    }

    const handleOwnerBuildingRemoval = (e: any) => {
        setInput((prev: any) => ({
            ...prev,
            ["ownedBuildings"]: prev["ownedBuildings"].filter((building: { buildingId: string }) => building.buildingId !== e.target.id)
        }))
    }

    return (
        !isLoading ? (
            < div >
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb link="/dashboard/companies" text="Companies" />
                            <Breadcrumb active text="Add new Company" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">Update company</p>
                    </div>
                </div>

                <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8">
                    <Form onSubmit={handleSubmitEvent} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                            <Form.Control required type="text" value={input.name} onChange={handleInput} name="name" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <Form.Group>
                            {/* defaultValue={input.company ? input.company : "none"} */}
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Located in</Form.Label>
                            <Form.Select required onChange={handleInput} name="buildingId" aria-label="Default select example">
                                <option value="none">Select a building</option>
                                {
                                    buildingNames.map((buildingName, index) => {
                                        return <option key={index} value={buildingName.id} >{buildingName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            {/* defaultValue={input.company ? input.company : "none"} */}
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Buildings Owned</Form.Label>
                            <Form.Select required onChange={handleOwnerBuildingInput} defaultValue="none" name="ownedBuildings" aria-label="Default select example">
                                <option value="none">Select a building to add</option>
                                {
                                    buildingNames.map((buildingName, index) => {
                                        // selected={building.company[0] && (building.company[0]._id === buildingName._id) ? true : false}
                                        return <option key={index} value={buildingName.id} >{buildingName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>

                        <div className={"flex gap-2" + (input.ownedBuildings.length > 0 ? " flex-wrap" : " hidden")}>
                            {
                                input.ownedBuildings.length > 0
                                    ? input.ownedBuildings.map((item) =>
                                        <Button onClick={handleOwnerBuildingRemoval} className="bg-[#e8f1fd] text-[#0b3f7f] flex items-center gap-2" key={item.buildingId} id={item.buildingId}>{buildingNames.find((buildingName) => buildingName.id === item.buildingId)?.name} <i className="fa-solid fa-xmark text-[#d7373f]"></i></Button>
                                    )
                                    : <div></div>
                            }
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button type="submit" className="flex  items-center justify-center gap-2">
                                <i className="fa-solid fa-plus"></i>
                                Create
                            </Button>
                        </div>
                    </Form>
                </div>
            </ div >
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default CompaniesAddScreen