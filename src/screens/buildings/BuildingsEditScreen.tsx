import { Button, Form, Spinner } from "react-bootstrap"
import Breadcrumb from "../../components/Breadcrumb"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import { useAuth } from "../../hooks/AuthProvider"
import { useLocation, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useFetchBuildingById, useFetchCompanyNames } from "../../hooks/useFetchQueries"
import { IBuildings } from "../../types/buildings.types"
import { ICompanyNames } from "../../types/form.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBuildingById, updateBuildingById } from "../../controllers/buildingsController"
import { updateCompanyOwnedBuildingsById } from "../../controllers/companyController"
import { SubmitHandler, useForm } from "react-hook-form"
import { checkResource } from "../../helpers/checkResource"

type FormFields = {
    name: string,
    address: string,
    company: string
}

const BuildingsEditScreen = (props: { resource: string[] }) => {
    const navigate = useNavigate()
    const auth = useAuth()
    const params = useParams()
    const [building, setBuilding] = useState<IBuildings>(useLocation().state)
    const [companyNames, setCompanyNames] = useState<ICompanyNames[]>([{
        name: "name",
        _id: "_id",
        ownedBuildings: [{
            buildingId: "_id"
        }]
    }])
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);

    const { register, handleSubmit, formState: { isSubmitting }, getValues, setValue } = useForm<FormFields>()

    const { data: buildingData, status: buildingStatus } = useFetchBuildingById(params.id)
    const { data: companyNamesData, status: companyNamesStatus } = useFetchCompanyNames()

    useEffect(() => {
        if (!checkResource(props.resource)) {
            navigate('/dashboard')
        }

        if (buildingStatus === 'success' && companyNamesStatus === 'success') {
            setBuilding(buildingData[0])
            setValue("company", buildingData[0].company[0] ? buildingData[0].company[0]._id : "none")
            setValue("name", buildingData[0].name)
            setValue("address", buildingData[0].address)
            setCompanyNames(companyNamesData)
            setIsLoading(false)
        }

        if (reloading) {
            setReloading(false)
        }

    }, [buildingStatus, companyNamesStatus, buildingData, companyNamesData, reloading, setValue, auth, props.resource, navigate])

    const { mutateAsync: mutateCompany } = useMutation({
        mutationFn: (data: { ownedBuildings: [{ buildingId: string, buildingName?: string }] }) => {
            return updateCompanyOwnedBuildingsById(getValues("company") !== 'none' ? getValues("company") : building.company[0]._id, data)
        },
        onError: () => {
            toast.error("Error updating company", { theme: "colored", position: "bottom-right" })
        }
    })

    const queryClient = useQueryClient();
    const { mutateAsync: mutateBuilding } = useMutation({
        mutationFn: (data: { name: string, address: string }) => {
            return updateBuildingById(building._id, data)
        },
        onSuccess: async () => {
            if (building.company[0] ? building.company[0]._id !== getValues("company") : getValues("company") !== "none") {
                await mutateCompany(getValues("company") !== 'none' ? { "ownedBuildings": [{ "buildingId": building._id }] } : { "ownedBuildings": [{ "buildingId": building._id, "buildingName": "none" }] })
            }
            queryClient.invalidateQueries({ queryKey: ['buildings'] })
            toast.success("Update successful", { theme: "colored", position: "bottom-right" })
        },
        onError: () => {
            toast.error("Error updating building", { theme: "colored", position: "bottom-right" })
        }
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (data.address !== building.address || data.name !== building.name || (building.company[0] ? building.company[0]._id !== data.company : data.company !== "none")) {
            await mutateBuilding({ name: data.name, address: data.address })
            setReloading(true)
            return
        }
        toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
    }

    const { mutateAsync: deleteBuildingFunc } = useMutation({
        mutationFn: deleteBuildingById,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['buildings'] })
            toast.success('Building deleted successfully', { theme: "colored", position: "bottom-right" })
            navigate("/dashboard/buildings")
        },
        onError: (error) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const handleDelete = async () => {
        await deleteBuildingFunc(building._id)
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
                    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                            <Form.Control required type="text" defaultValue={getValues("name")} {...register("name")} name="name" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Owned By</Form.Label>
                            <Form.Select required defaultValue={getValues("company")} {...register("company")} name="company" aria-label="Default select example">
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
                            <Form.Control required type="text" defaultValue={getValues("address")} {...register("address")} name="address" placeholder="Enter location" className="" />
                        </Form.Group>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button disabled={isSubmitting} type="submit" className="flex  items-center justify-center gap-2">
                                <i className={`fa-regular fa-pen-to-square ${isSubmitting ? "hidden" : ""}`}></i>
                                {
                                    isSubmitting ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : "Update"
                                }
                            </Button>

                            <Button onClick={handleDelete} variant="danger" className="flex  items-center justify-center gap-2">
                                <i className="fa-solid fa-trash"></i>
                                Delete
                            </Button>
                        </div>
                    </Form>
                </div >
            </ div >
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default BuildingsEditScreen