import { Button, Form } from "react-bootstrap"
import Breadcrumb from "../../components/Breadcrumb"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import { useAuth } from "../../hooks/AuthProvider"
import { useLocation, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"

const BuildingsEditScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const navigate = useNavigate()
    const [building, setBuilding] = useState<{ name: string, _id: string, address: string, company: { name: string, _id: string }[] }>(useLocation().state)
    const [companyNames, setCompanyNames] = useState<{ name: string, _id: string, ownedBuildings: { buildingId: string }[] }[]>([{
        name: "name",
        _id: "_id",
        ownedBuildings: [{
            buildingId: "_id"
        }]
    }])
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);

    const [input, setInput] = useState({
        name: "",
        address: "",
        company: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useApiClient._getWithToken(`/building/${params.id}`, auth.accessToken)
                setBuilding(response.data[0])
                setInput({
                    name: response.data[0].name,
                    address: response.data[0].address,
                    company: response.data[0].company[0] ? response.data[0].company[0]._id : "none"
                })
            } catch (error) {
                console.error("Error fetching building data:", error)
            }
        }

        const fetchCompanyNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/company/companyNames', auth.accessToken)
                setCompanyNames(response.data)
            } catch (error) {
                console.error("Error fetching company names:", error)
            }
        }

        const loadData = async () => {
            try {
                await Promise.all([fetchData(), fetchCompanyNames()])
            } catch (error) {
                console.error("Error loading data:", error)
            } finally {
                setIsLoading(false)
                if (reloading) {
                    setReloading(false)
                }
            }
        }

        loadData()
    }, [auth, params.id, reloading, setReloading])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        if (input.address !== building.address || input.name !== building.name || (building.company[0] ? building.company[0]._id !== input.company : input.company !== "none")) {
            try {
                const result = await useApiClient._patchWithToken(`/building/${building._id}`, { name: input.name, address: input.address }, auth.accessToken)
                if (building.company[0] ? building.company[0]._id !== input.company : input.company !== "none") {
                    const resultB = await useApiClient._patchWithToken(input.company !== 'none' ? `/company/${input.company}` : `/company/${building.company[0]._id}`, input.company !== 'none' ? { "ownedBuildings": [{ "buildingId": building._id }] } : { "ownedBuildings": [{ "buildingId": building._id, "buildingName": "none" }] }, auth.accessToken)
                    console.log(resultB.status)
                }
                if (result.status === 200) {
                    toast.success('Update successful', { theme: "colored", position: "bottom-right" })
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
            }
            setReloading(true)
            return
        }
        toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInput = (e: any) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDelete = async () => {
        try {
            const result = await useApiClient._deleteWithToken(`/building/${building._id}`, auth.accessToken)
            console.log(result.status)
            toast.success('Building deleted successfully', { theme: "colored", position: "bottom-right" })
            navigate("/dashboard/buildings")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                            <Breadcrumb link="/dashboard/buildings" text="Buildings" />
                            <Breadcrumb state={building} link={`/dashboard/buildings/${building._id}`} text={building.name} />
                            <Breadcrumb active text="Edit" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">Update building</p>
                    </div>
                </div>

                <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8">
                    <Form onSubmit={handleSubmitEvent} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                            <Form.Control required type="text" value={input.name} onChange={handleInput} name="name" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Owned By</Form.Label>
                            <Form.Select required defaultValue={input.company ? input.company : "none"} onChange={handleInput} name="company" aria-label="Default select example">
                                <option value="none">none</option>
                                {
                                    companyNames.map((companyName, index) => {
                                        return <option key={index} selected={building.company[0] && (building.company[0]._id === companyName._id) ? true : false} value={companyName._id} >{companyName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Location</Form.Label>
                            <Form.Control required type="text" value={input.address} onChange={handleInput} name="address" placeholder="Enter location" className="" />
                        </Form.Group>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button type="submit" className="flex  items-center justify-center gap-2">
                                <i className="fa-regular fa-pen-to-square"></i>
                                Update
                            </Button>

                            <Button onClick={handleDelete} variant="danger" className="flex  items-center justify-center gap-2">
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

export default BuildingsEditScreen