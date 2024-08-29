/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"

const AccessCardsAddScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);

    const [input, setInput] = useState<{ employeeId: string }>({
        employeeId: ""
    })
    const [employeeNames, setEmployeeNames] = useState<{ name: string, id: string }[]>([{
        name: "name",
        id: "id"
    }])

    useEffect(() => {
        const fetchEmployeeNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/employee/employeeNames', auth.accessToken)
                console.log(response.data)
                setEmployeeNames(response.data)
            } catch (error) {
                console.error('Error fetching company names:', error)
            }
        }
        const loadData = async () => {
            await Promise.all([fetchEmployeeNames()])
            setIsLoading(false)
            if (reloading) {
                setReloading(false)
            }
        }

        loadData()
    }, [auth, params.id, reloading, setReloading])


    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        if (input.employeeId !== "") {
            {
                try {
                    console.log(input)
                    const result = await useApiClient._postWithToken(`/access-card`, {
                        cardHolder: {
                            employeeId: input.employeeId
                        }
                    }, auth.accessToken)
                    console.log(result.status)
                    toast.success('Access card created successfully', { theme: "colored", position: "bottom-right" })
                    navigate(`/dashboard/access-cards/${result.data.id}`)
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

    return (
        !isLoading ? (
            < div >
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb link="/dashboard/access-cards" text="Access Cards" />
                            <Breadcrumb active text="Add New Access Card" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">Update Access Card</p>
                    </div>
                </div>

                <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8">
                    <Form onSubmit={handleSubmitEvent} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Employee Name</Form.Label>
                            <Form.Select required onChange={handleInput} defaultValue="none" name="employeeId" aria-label="Default select example">
                                <option value="none">Select an employee</option>
                                {
                                    employeeNames.map((employeeName) => (
                                        <option key={employeeName.id} value={employeeName.id}>{employeeName.name}</option>
                                    ))
                                }
                            </Form.Select>
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

export default AccessCardsAddScreen