import { Button, Form, Spinner } from "react-bootstrap"
import Breadcrumb from "../../components/Breadcrumb"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import { useFetchCompanyNames } from "../../hooks/useFetchQueries"
import { ICompanyNames } from "../../types/form.types"
import { useMutation } from "@tanstack/react-query"
import { addBuilding } from "../../controllers/buildingsController"
import { updateCompanyById } from "../../controllers/companyController"
import { SubmitHandler, useForm } from 'react-hook-form'
import { checkResource } from "../../helpers/checkResource"

type FormFields = {
    name: string,
    address: string,
    company: string
}

const BuildingsAddScreen = (props: { resource: string[] }) => {
    const navigate = useNavigate()
    if (!checkResource(props.resource)) {
        navigate('/dashboard')
    }

    const [companyNames, setCompanyNames] = useState<ICompanyNames[]>([{
        name: "name",
        _id: "_id",
        ownedBuildings: [{
            buildingId: "_id"
        }]
    }])
    const [isLoading, setIsLoading] = useState(true)

    const { register, handleSubmit, formState: { isSubmitting }, getValues } = useForm<FormFields>({
        defaultValues: {
            company: "none"
        }
    })

    const { data: companyNamesData, status: companyNamesStatus } = useFetchCompanyNames()

    useEffect(() => {
        if (companyNamesStatus === "success") {
            setCompanyNames(companyNamesData)
            setIsLoading(false)
        }

    }, [companyNamesStatus, companyNamesData])

    const { mutateAsync: mutateCompany } = useMutation({
        mutationFn: (data: string) => {
            return updateCompanyById(getValues("company"), { ownedBuildings: [{ "buildingId": data }] })
        },
        onError: () => {
            toast.error("Error updating company", { theme: "colored", position: "bottom-right" })
        }
    })

    const { mutateAsync: mutateBuilding } = useMutation({
        mutationFn: addBuilding,
        onSuccess: async (newBuilding) => {
            console.log(newBuilding)
            if (getValues("company") !== "none") {
                await mutateCompany(newBuilding.data.id)
            }
            // queryClient.invalidateQueries({ queryKey: ["buildings"] })
            toast.success("Building created successfully", { theme: "colored", position: "bottom-right" })
            navigate("/dashboard/buildings")
        },
        onError: () => {
            toast.error("Error creating building", { theme: "colored", position: "bottom-right" })
        }
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (data.name.length > 0 && data.company.length) {
            await mutateBuilding({ name: data.name, address: data.address })
        }
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
                    <Form className="flex flex-col gap-[1rem] md:gap-[1.5rem]" onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                            <Form.Control {...register("name", { required: true })} required type="text" name="name" placeholder="Enter building name" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Owned By</Form.Label>
                            <Form.Select required {...register("company")} defaultValue="none" aria-label="Default select example">
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
                            <Form.Control {...register("address", { required: true })} required type="text" name="address" placeholder="Enter location" className="" />
                        </Form.Group>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button disabled={isSubmitting} type="submit" className="flex  items-center justify-center gap-2">
                                <i className={`fa-solid fa-plus ${isSubmitting ? "hidden" : ""}`}></i>
                                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Create"}
                            </Button>
                        </div>
                    </Form>
                </div>
            </ div >
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default BuildingsAddScreen