/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form, Spinner } from "react-bootstrap"
import { IAccessCards, IAccessCardsUpdate } from "../../types/accessCards.types"
import { useFetchAccessCardById } from "../../hooks/useFetchQueries"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAccessCardById, updateAccessCard } from "../../controllers/accessCardsController"

type FormFields = {
    cardNumber: string,
    is_active: boolean,
    issued_date: string,
}

const AccessCardsEditScreen = () => {
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [accessCard, setAccessCard] = useState<IAccessCards>(location.state)
    const [isLoading, setIsLoading] = useState(true)

    const { data, status } = useFetchAccessCardById(params.id!)

    const { register, handleSubmit, formState: { isSubmitting }, setValue } = useForm<FormFields>()

    useEffect(() => {
        if (status === 'success') {
            setAccessCard(data)
            setValue('cardNumber', accessCard.cardNumber)
            setValue('is_active', accessCard.is_active)
            setValue('issued_date', accessCard.issued_at.split('T')[0])
            setIsLoading(false)
        }
    }, [status, data, setValue, accessCard])

    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: (data: IAccessCardsUpdate) => {
            return updateAccessCard(params.id!, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accessCards'] })
            toast.success('Access card updated successfully', { theme: "colored", position: "bottom-right" })
        },
        onError: (error: any) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (data.cardNumber !== accessCard.cardNumber || data.is_active !== accessCard.is_active) {
            await mutateAsync({
                cardNumber: data.cardNumber,
                is_active: data.is_active
            })
            return
        }
        toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
    }

    const { mutateAsync: deleteAccessCard } = useMutation({
        mutationFn: deleteAccessCardById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accessCards'] })
            toast.success('Access card deleted successfully', { theme: "colored", position: "bottom-right" })
            navigate('/dashboard/access-cards')
        },
        onError: (error: any) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const handleDelete = async () => {
        await deleteAccessCard(params.id!)
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
                    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Card Number</Form.Label>
                            <Form.Control required type="text" {...register("cardNumber")} name="cardNumber" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Issued on</Form.Label>
                            <Form.Control required type="date" disabled {...register("issued_date")} name="issued_at" placeholder="Enter building name" className="" />
                        </Form.Group>

                        {/* <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Valid until</Form.Label>
                            <Form.Control type="date" value={input.valid_until} onChange={handleInput} name="valid_until" placeholder="Enter building name" className="" />
                        </Form.Group> */}

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Card Number</Form.Label>
                            <Form.Select required {...register("is_active")} name="is_active" aria-label="Default select example">
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button disabled={isSubmitting} type="submit" className="flex  items-center justify-center gap-2">
                                <i className={`fa-regular fa-pen-to-square ${isSubmitting ? "hidden" : ""}`}></i>
                                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Update"}
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