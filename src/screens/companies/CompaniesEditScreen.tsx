/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"

const CompaniesEditScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const navigate = useNavigate()
    const [company, setCompany] = useState<{ name: string, id: string, buildings: { buildingName: string, buildingId: string }, ownedBuildings: { buildingName: string; }[] }>(useLocation().state)
    const [buildingNames, setBuildingNames] = useState<{ name: string, id: string }[]>([{
        name: "",
        id: ""
    }])
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);

    const [input, setInput] = useState<{ name: string, buildingId: string, ownedBuildings: { buildingId: string }[] | [] }>({
        name: "",
        buildingId: "",
        ownedBuildings: []
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useApiClient._getWithToken(`/company/${params.id}`, auth.accessToken)
                setCompany(response.data)
                setInput({
                    name: response.data.name,
                    buildingId: response.data.buildings.buildingId,
                    ownedBuildings: response.data.ownedBuildings.map((building: { buildingId: string }) => ({ buildingId: building.buildingId }))
                })
            } catch (error) {
                console.error('Error fetching company data:', error)
                toast.error('Failed to fetch company data')
            }
        }

        const fetchBuildingNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/building/buildingNames', auth.accessToken)
                setBuildingNames(response.data)
            } catch (error) {
                console.error('Error fetching building names:', error)
                toast.error('Failed to fetch building names')
            }
        }

        const loadData = async () => {
            await Promise.all([fetchData(), fetchBuildingNames()])
            setIsLoading(false)
            if (reloading) {
                setReloading(false)
            }
        }

        loadData()
    }, [auth, params.id, reloading, setReloading])


    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        if (input.name !== company.name || input.buildingId !== company.buildings.buildingId || (company?.buildings ? company?.buildings.buildingId !== input.buildingId : input.buildingId !== "") || !areArraysEqual(input.ownedBuildings, company.ownedBuildings)) {
            try {
                console.log(input)
                const result = await useApiClient._patchWithToken(`/company/${company.id}`, { name: input.name, buildingId: input.buildingId, ownedBuildings: input.ownedBuildings }, auth.accessToken)
                console.log(result.status)
                toast.success('Update successful', { theme: "colored", position: "bottom-right" })
            } catch (error: any) {
                // console.log(error.response.data.code)
                if (error.response.data.code === 400) {
                    toast.error("Please wait for 5 seconds before updating again", { theme: "colored", position: "bottom-right" })
                } else
                    toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
            }
            setReloading(true)
            return
        }
        toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
    }

    const areArraysEqual = (arr1: any[], arr2: any[]) => {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
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

    const handleDelete = async () => {
        try {
            const result = await useApiClient._deleteWithToken(`/company/${company.id}`, auth.accessToken)
            console.log(result.status)
            toast.success('Company deleted successfully', { theme: "colored", position: "bottom-right" })
            navigate("/dashboard/companies")
        } catch (error: any) {
            toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
        }
    }

    return (
        !isLoading ? (
            < div >
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb link="/dashboard/companies" text="Companies" />
                            <Breadcrumb state={company} link={`/dashboard/companies/${company.id}`} text={company.name} />
                            <Breadcrumb active text="Edit" />
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
                                {
                                    buildingNames.map((buildingName, index) => {
                                        return <option key={index} selected={company.buildings.buildingId === buildingName.id ? true : false} value={buildingName.id} >{buildingName.name}</option>
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
                                <i className="fa-regular fa-pen-to-square"></i>
                                Update
                            </Button>

                            <Button onClick={() => {
                                if (window.confirm("Are you sure you want to delete this company & its associated employees?")) {
                                    handleDelete()
                                }
                            }} variant="danger" className="flex  items-center justify-center gap-2">
                                <i className="fa-solid fa-trash"></i>
                                Delete
                            </Button>
                        </div>
                    </Form>
                </div>
            </ div >
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default CompaniesEditScreen