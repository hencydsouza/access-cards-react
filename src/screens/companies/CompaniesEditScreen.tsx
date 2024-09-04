/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form, Spinner } from "react-bootstrap"
import { checkResource } from "../../helpers/checkResource"
import { useFetchBuildingNames, useFetchCompanyById } from "../../hooks/useFetchQueries"
import { IBuildingNames } from "../../types/form.types"
import { ICompany } from "../../types/company.types"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCompanyById } from "../../controllers/companyController"

type FormFields = {
    name: string;
    buildingId: string;
    ownedBuildings: { buildingId: string }[]
}

const CompaniesEditScreen = (props: { resource: string[] }) => {
    const navigate = useNavigate()

    const params = useParams()
    const [company, setCompany] = useState<ICompany>(useLocation().state)
    const [buildingNames, setBuildingNames] = useState<IBuildingNames[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);

    const { data: buildingNamesData, status: buildingNamesStatus } = useFetchBuildingNames()
    const { data: companyData, status: companyStatus } = useFetchCompanyById(params.id)

    const { register, handleSubmit, formState: { isSubmitting }, getValues, setValue, watch } = useForm<FormFields>()

    const ownedBuildings = watch("ownedBuildings")

    useEffect(() => {
        if (!checkResource(props.resource)) {
            navigate('/dashboard')
        }
    }, [props.resource, navigate])

    useEffect(() => {
        if (companyStatus === 'success' && buildingNamesStatus === 'success') {
            setBuildingNames(buildingNamesData)
            setCompany(companyData)
            setValue("name", companyData.name)
            setValue("buildingId", companyData.buildings.buildingId)
            setValue("ownedBuildings", companyData.ownedBuildings.map((building: { buildingId: string }) => ({ buildingId: building.buildingId })))
            setIsLoading(false)
        }

        if (reloading) {
            setReloading(false)
        }

    }, [reloading, setReloading, companyData, setCompany, companyStatus, buildingNamesData, setBuildingNames, buildingNamesStatus, setValue])

    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: (data: FormFields) => {
            return updateCompanyById(params.id || "", data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] })
            toast.success('Company updated successfully', { theme: "colored", position: "bottom-right" })
        },
        onError: (error: any) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (data.name !== company.name || data.buildingId !== company.buildings.buildingId || (company?.buildings ? company?.buildings.buildingId !== data.buildingId : data.buildingId !== "") || !areArraysEqual(data.ownedBuildings, company.ownedBuildings)) {
            console.log(data)
            await mutateAsync({ name: data.name, buildingId: data.buildingId, ownedBuildings: data.ownedBuildings })
            // setReloading(true)
            return
        }
        toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
    }

    // const handleSubmitEvent = async (e: any) => {
    //     e.preventDefault();
    //     if (input.name !== company.name || input.buildingId !== company.buildings.buildingId || (company?.buildings ? company?.buildings.buildingId !== input.buildingId : input.buildingId !== "") || !areArraysEqual(input.ownedBuildings, company.ownedBuildings)) {
    //         try {
    //             console.log(input)
    //             const result = await useApiClient._patchWithToken(`/company/${company.id}`, { name: input.name, buildingId: input.buildingId, ownedBuildings: input.ownedBuildings }, auth.accessToken)
    //             console.log(result.status)
    //             toast.success('Update successful', { theme: "colored", position: "bottom-right" })
    //         } catch (error: any) {
    //             // console.log(error.response.data.code)
    //             if (error.response.data.code === 400) {
    //                 toast.error("Please wait for 5 seconds before updating again", { theme: "colored", position: "bottom-right" })
    //             } else
    //                 toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
    //         }
    //         setReloading(true)
    //         return
    //     }
    //     toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
    // }

    const areArraysEqual = (arr1: any[], arr2: any[]) => {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    const handleOwnerBuildingInput = (e: any) => {
        const { value } = e.target
        const currentOwnedBuildings = getValues("ownedBuildings") || []
        if (!currentOwnedBuildings.some((building: { buildingId: string }) => building.buildingId === value)) {
            const updatedOwnedBuildings = [
                ...currentOwnedBuildings,
                {
                    buildingId: value
                }
            ]
            setValue("ownedBuildings", updatedOwnedBuildings)
        }
        e.target.value = "none"
    }

    const handleOwnerBuildingRemoval = (e: React.MouseEvent<HTMLButtonElement>) => {
        const currentOwnedBuildings = getValues("ownedBuildings") || []
        const updatedOwnedBuildings = currentOwnedBuildings.filter(
            (building: { buildingId: string }) => building.buildingId !== e.currentTarget.id
        )
        setValue("ownedBuildings", updatedOwnedBuildings)
    }

    const handleDelete = async () => {
        try {
            await useApiClient._delete(`/company/${company.id}`)
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
                    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                            <Form.Control required type="text" defaultValue={getValues("name")} {...register("name")} name="name" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <Form.Group>
                            {/* defaultValue={input.company ? input.company : "none"} */}
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Located in</Form.Label>
                            <Form.Select required defaultValue={getValues("buildingId")} {...register("buildingId")} name="buildingId" aria-label="Default select example">
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
                                        return <option key={index} value={buildingName.id} >{buildingName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>

                        <div className={"flex gap-2" + (ownedBuildings.length > 0 ? " flex-wrap" : " hidden")}>
                            {
                                ownedBuildings.length > 0
                                    ? ownedBuildings.map((item) =>
                                        <Button onClick={handleOwnerBuildingRemoval} className="bg-[#e8f1fd] text-[#0b3f7f] flex items-center gap-2" key={item.buildingId} id={item.buildingId}>{buildingNames.find((buildingName) => buildingName.id === item.buildingId)?.name} <i className="fa-solid fa-xmark text-[#d7373f]"></i></Button>
                                    )
                                    : <div></div>
                            }
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button type="submit" disabled={isSubmitting} className="flex  items-center justify-center gap-2">
                                <i className={`fa-regular fa-pen-to-square ${isSubmitting ? "hidden" : ""}`}></i>
                                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Update"}
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