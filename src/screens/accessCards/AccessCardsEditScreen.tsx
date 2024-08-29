/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"

const AccessCardsEditScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [accessCard, setAccessCard] = useState<{ cardHolder: { buildingId: string, companyId: string, employeeId: string }, cardNumber: string, id: string, is_active: boolean, issued_at: string, valid_until: string | null }>(location.state)
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);

    const [input, setInput] = useState<{ cardHolder: { buildingId: string, companyId: string, employeeId: string }, cardNumber: string, id: string, is_active: string, issued_at: string, valid_until: string }>({
        cardHolder: {
            buildingId: "",
            companyId: "",
            employeeId: ""
        },
        cardNumber: "",
        id: "",
        is_active: "",
        issued_at: "",
        valid_until: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useApiClient._getWithToken(`/access-card/${params.id}`, auth.accessToken)
                console.log(response.data)
                setAccessCard(response.data)
                setInput({
                    cardHolder: {
                        buildingId: response.data.cardHolder.buildingId,
                        companyId: response.data.cardHolder.companyId,
                        employeeId: response.data.cardHolder.employeeId
                    },
                    cardNumber: response.data.cardNumber,
                    id: response.data.id,
                    is_active: String(response.data.is_active),
                    issued_at: response.data.issued_at.split('T')[0],
                    valid_until: response.data.valid_until ? response.data.valid_until.split('T')[0] : ""
                })
            } catch (error) {
                console.error('Error fetching company data:', error)
            }
        }

        const loadData = async () => {
            await Promise.all([fetchData()])
            setIsLoading(false)
            if (reloading) {
                setReloading(false)
            }
        }

        loadData()
    }, [auth, params.id, reloading, setReloading])


    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        if (input.cardNumber !== accessCard.cardNumber || (accessCard.valid_until && (input.valid_until !== accessCard.valid_until.split("T")[0])) || input.is_active !== accessCard.is_active.toString() || input.issued_at !== accessCard.issued_at.split('T')[0]) {
            {
                try {
                    console.log(input)
                    const result = await useApiClient._patchWithToken(`/access-card/${accessCard.id}`,
                        {
                            cardNumber: input.cardNumber,
                            is_active: input.is_active === "true" ? true : false,
                            issued_at: (new Date(input.issued_at)).toISOString(),
                        },
                        auth.accessToken)
                    console.log(result.status)
                    toast.success('Update successful', { theme: "colored", position: "bottom-right" })
                } catch (error: any) {
                    toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
                }
                setReloading(true)
                return
            }
        }
        toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
    }


    const handleInput = (e: any) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value
        }))
        console.log(input)
    }

    const handleDelete = async () => {
        try {
            const result = await useApiClient._deleteWithToken(`/access-card/${accessCard.id}`, auth.accessToken)
            console.log(result.status)
            toast.success('Access card deleted successfully', { theme: "colored", position: "bottom-right" })
            navigate("/dashboard/access-cards")
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
                            <Breadcrumb link="/dashboard/access-cards" text="Access Cards" />
                            <Breadcrumb state={accessCard} link={`/dashboard/access-cards/${accessCard.id}`} text={accessCard.cardNumber} />
                            <Breadcrumb active text="Edit" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">Update Access Card</p>
                    </div>
                </div>

                <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8">
                    <Form onSubmit={handleSubmitEvent} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Card Number</Form.Label>
                            <Form.Control required type="text" value={input.cardNumber} onChange={handleInput} name="cardNumber" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Issued on</Form.Label>
                            <Form.Control required type="date" disabled value={input.issued_at} onChange={handleInput} name="issued_at" placeholder="Enter building name" className="" />
                        </Form.Group>

                        {/* <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Valid until</Form.Label>
                            <Form.Control type="date" value={input.valid_until} onChange={handleInput} name="valid_until" placeholder="Enter building name" className="" />
                        </Form.Group> */}

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Card Number</Form.Label>
                            <Form.Select required onChange={handleInput} defaultValue={String(input.is_active)} name="is_active" aria-label="Default select example">
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button type="submit" className="flex  items-center justify-center gap-2">
                                <i className="fa-regular fa-pen-to-square"></i>
                                Update
                            </Button>

                            <Button onClick={() => {
                                if (window.confirm("Are you sure you want to delete this access card?")) {
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

export default AccessCardsEditScreen