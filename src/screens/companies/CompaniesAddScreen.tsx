/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router"
import { useFetchBuildingNames } from "../../hooks/useFetchQueries"
import { IBuildingNames } from "../../types/form.types"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { addCompany } from "../../controllers/companyController"
import { ICompanyCreate } from "../../types/company.types"
import { checkResource } from "../../helpers/checkResource"

type FormFields = {
    name: string,
    buildingId: string,
    ownedBuildings: { buildingId: string }[] | []
}

const CompaniesAddScreen = (props: { resource: string[] }) => {
    const navigate = useNavigate()
    const [buildingNames, setBuildingNames] = useState<IBuildingNames[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(false)

    // const [input, setInput] = useState<{ name: string, buildingId: string, ownedBuildings: { buildingId: string }[] | [] }>({
    //     name: "",
    //     buildingId: "",
    //     ownedBuildings: []
    // })

    const { data, status: buildingStatus } = useFetchBuildingNames()

    useEffect(() => {
        if (!checkResource(props.resource)) {
            navigate('/dashboard')
        }

        if (buildingStatus === "success") {
            setBuildingNames(data)
            setIsLoading(false)
        }
        setReload(false)
    }, [data, buildingStatus, reload, props.resource, navigate])

    const { mutateAsync: mutateCompany } = useMutation({
        mutationFn: addCompany,
        onSuccess: (newCompany) => {
            toast.success('Company created successfully', { theme: "colored", position: "bottom-right" })
            navigate(`/dashboard/companies/${newCompany.data.id}`)
        },
        onError: (error) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    // const handleSubmitEvent = async (e: any) => {
    //     e.preventDefault();
    //     try {
    //         if (input.name.length > 0 && input.buildingId !== "none" && input.buildingId.length > 0 && input.ownedBuildings) {
    //             if (input.ownedBuildings.length > 0) {
    //                 const result = await useApiClient._postWithToken(`/company`, { name: input.name, buildingId: input.buildingId, ownedBuildings: input.ownedBuildings }, auth.accessToken)
    //                 console.log(result.status)
    //                 toast.success('Company created successfully', { theme: "colored", position: "bottom-right" })
    //                 navigate(`/dashboard/companies/${result.data.id}`)
    //             } else {
    //                 const result = await useApiClient._postWithToken(`/company`, { name: input.name, buildingId: input.buildingId }, auth.accessToken)
    //                 console.log(result.status)
    //                 toast.success('Company created successfully', { theme: "colored", position: "bottom-right" })
    //                 navigate(`/dashboard/companies/${result.data.id}`)
    //             }
    //             return
    //         }
    //         toast.error("Please fill all the fields", { theme: "colored", position: "bottom-right" })
    //     } catch (error: any) {
    //         toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
    //     }
    // }

    const { register, handleSubmit, formState: { isSubmitting }, getValues, setValue } = useForm<FormFields>({
        defaultValues: {
            ownedBuildings: []
        }
    })

    const handleOwnerBuildingInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        console.log(name, value)
        const currentValues = getValues(name as keyof FormFields) as { buildingId: string }[]
        console.log(currentValues)

        if (!currentValues.some(building => building.buildingId === value)) {
            const updatedValues = [...currentValues, { buildingId: value }]
            setValue(name as keyof FormFields, updatedValues)
        }

        setReload(true)
        e.target.value = "none"
    }

    const handleOwnerBuildingRemoval = (e: any) => {
        const currentValues = getValues('ownedBuildings') as { buildingId: string }[]
        const updatedValues = currentValues.filter(building => building.buildingId !== e.target.id)
        setValue('ownedBuildings', updatedValues)
        setReload(true)
    }

    const onSubmit: SubmitHandler<FormFields> = async (data: ICompanyCreate) => {
        if (getValues("name").length > 0 && getValues("buildingId") !== "none" && getValues("buildingId").length > 0) {
            // await mutateCompany({ name: data.name, address: data.address })
            if (getValues("ownedBuildings").length > 0) {
                await mutateCompany({ name: data.name, buildingId: data.buildingId, ownedBuildings: data.ownedBuildings })
            } else {
                await mutateCompany({ name: data.name, buildingId: data.buildingId })
            }
            return
        }
        toast.error("Please fill all the fields", { theme: "colored", position: "bottom-right" })
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
                    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                            <Form.Control required type="text" {...register("name")} name="name" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <Form.Group>
                            {/* defaultValue={input.company ? input.company : "none"} */}
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Located in</Form.Label>
                            <Form.Select required {...register("buildingId")} name="buildingId" aria-label="Default select example">
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

                        <div className={"flex gap-2" + (getValues("ownedBuildings").length > 0 ? " flex-wrap" : " hidden")}>
                            {
                                getValues("ownedBuildings").length > 0
                                    ? getValues("ownedBuildings").map((item) =>
                                        <Button onClick={handleOwnerBuildingRemoval} className="bg-[#e8f1fd] text-[#0b3f7f] flex items-center gap-2" key={item.buildingId} id={item.buildingId}>{buildingNames.find((buildingName) => buildingName.id === item.buildingId)?.name} <i className="fa-solid fa-xmark text-[#d7373f]"></i></Button>
                                    )
                                    : <div></div>
                            }
                        </div>

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

export default CompaniesAddScreen