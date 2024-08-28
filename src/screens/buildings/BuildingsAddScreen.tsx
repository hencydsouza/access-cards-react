import { Button, Form } from "react-bootstrap"
import Breadcrumb from "../../components/Breadcrumb"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { useAuth } from "../../hooks/AuthProvider"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"

const BuildingsAddScreen = () => {
    const auth = useAuth()
    const navigate = useNavigate()
    const [companyNames, setCompanyNames] = useState<{ name: string, _id: string, ownedBuildings: { buildingId: string }[] }[]>([{
        name: "name",
        _id: "_id",
        ownedBuildings: [{
            buildingId: "_id"
        }]
    }])
    const [isLoading, setIsLoading] = useState(true)

    const [input, setInput] = useState({
        name: "",
        address: "",
        company: "none"
    })

    useEffect(() => {
        const fetchCompanyNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/company/companyNames', auth.accessToken)
                setCompanyNames(response.data)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching company names:', error)
            }
        }

        fetchCompanyNames()
    }, [auth])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        try {
            if (input.name.length > 0 && input.company.length) {
                const result = await useApiClient._postWithToken('/building', { name: input.name, address: input.address }, auth.accessToken)
                console.log(result.data)
                if (input.company !== "none") {
                    const resultB = await useApiClient._patchWithToken(`/company/${input.company}`, { "ownedBuildings": [{ "buildingId": result.data.id }] }, auth.accessToken)
                    console.log(resultB.status)
                }
                navigate(`/dashboard/buildings/${result.data.id}`)
                toast.success("Building created successfully", { theme: "colored", position: "bottom-right" })
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInput = (e: any) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        !isLoading ? (

            < div >
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb link="/dashboard/buildings" text="Buildings" />
                            <Breadcrumb active text="Add New Building" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">Create new building</p>
                    </div>
                </div>

                <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8">
                    <Form className="flex flex-col gap-[1rem] md:gap-[1.5rem]" onSubmit={handleSubmitEvent}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                            <Form.Control onChange={handleInput} required type="text" name="name" placeholder="Enter building name" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Owned By</Form.Label>
                            <Form.Select required name="company" onChange={handleInput} defaultValue={input.company} aria-label="Default select example">
                                <option value="none">none</option>
                                {
                                    companyNames.map((companyName, index) => {
                                        return <option key={index} value={companyName._id} >{companyName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Location</Form.Label>
                            <Form.Control onChange={handleInput} required type="text" name="address" placeholder="Enter location" className="" />
                        </Form.Group>

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

export default BuildingsAddScreen