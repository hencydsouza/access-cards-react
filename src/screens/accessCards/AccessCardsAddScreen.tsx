import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form, Spinner } from "react-bootstrap"
import { useFetchEmployeeNames } from "../../hooks/useFetchQueries"
import { IEmployeeNames } from "../../types/form.types"
import { SubmitHandler, useForm } from "react-hook-form"
import { IAccessCardsCreate } from "../../types/accessCards.types"
import { addAccessCard } from "../../controllers/accessCardsController"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type FormFields = IAccessCardsCreate

const AccessCardsAddScreen = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);
    const [employeeNames, setEmployeeNames] = useState<IEmployeeNames[]>([])

    const { data: employeeNamesData, status: employeeNamesStatus } = useFetchEmployeeNames()

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormFields>()

    useEffect(() => {
        if (employeeNamesStatus === "success") {
            setEmployeeNames(employeeNamesData)
            setIsLoading(false)
        }

        if (reloading) {
            setReloading(false)
        }
    }, [employeeNamesData, employeeNamesStatus, reloading])

    const queryClient = useQueryClient()
    const { mutateAsync: mutateAccessCards } = useMutation({
        mutationFn: addAccessCard,
        onSuccess: (newAccessCard) => {
            queryClient.invalidateQueries({ queryKey: ["accessCards"] })
            toast.success('Access Card created successfully', { theme: "colored", position: "bottom-right" })
            navigate(`/dashboard/access-cards/${newAccessCard.data.id}`)
        },
        onError: (error) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (data.employeeId.length > 0) {
            await mutateAccessCards({
                cardHolder: {
                    employeeId: data.employeeId
                }
            })
            return
        }
        toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
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
                    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Employee Name</Form.Label>
                            <Form.Select required {...register("employeeId")} defaultValue="none" name="employeeId" aria-label="Default select example">
                                <option value="none">Select an employee</option>
                                {
                                    employeeNames.map((employeeName) => (
                                        <option key={employeeName.id} value={employeeName.id}>{employeeName.name}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button disabled={isSubmitting} type="submit" className="flex  items-center justify-center gap-2">
                                <i className={`fa-solid fa-plus ${isSubmitting ? "hidden" : ""}`}></i>
                                {
                                    isSubmitting ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : "Create"
                                }
                            </Button>
                        </div>
                    </Form>
                </div>
            </ div >
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default AccessCardsAddScreen