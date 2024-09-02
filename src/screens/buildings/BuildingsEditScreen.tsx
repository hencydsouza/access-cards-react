/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form } from "react-bootstrap"
import Breadcrumb from "../../components/Breadcrumb"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import { useAuth } from "../../hooks/AuthProvider"
import { useLocation, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import { useFetchBuildingById, useFetchCompanyNames } from "../../hooks/useFetchQueries"
import { IBuildings } from "../../types/buildings.types"
import { ICompanyNames } from "../../types/form.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBuildingById } from "../../controllers/buildingsController"
import { updateCompanyById } from "../../controllers/companyController"

const BuildingsEditScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const navigate = useNavigate()
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

    const [input, setInput] = useState({
        name: "",
        address: "",
        company: ""
    })

    const { data: buildingData, status: buildingStatus } = useFetchBuildingById(params.id)
    const { data: companyNamesData, status: companyNamesStatus } = useFetchCompanyNames()

    useEffect(() => {
        if (buildingStatus === 'success' && companyNamesStatus === 'success') {
            setBuilding(buildingData[0])
            setInput({
                name: buildingData[0].name,
                address: buildingData[0].address,
                company: buildingData[0].company[0] ? buildingData[0].company[0]._id : "none"
            })
            setCompanyNames(companyNamesData)
            setIsLoading(false)
        }

        if (reloading) {
            setReloading(false)
        }

    }, [buildingStatus, companyNamesStatus, buildingData, companyNamesData, reloading])

    const queryClient = useQueryClient()

    const { mutateAsync: mutateCompany } = useMutation({
        mutationFn: (data: { ownedBuildings: [{ buildingId: string, buildingName?: string }] }) => {
            return updateCompanyById(input.company !== 'none' ? input.company : building.company[0]._id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] })
        },
        onError: () => {
            toast.error("Error updating company", { theme: "colored", position: "bottom-right" })
        }
    })

    const { mutateAsync: mutateBuilding } = useMutation({
        mutationFn: (data: { name: string, address: string }) => {
            return updateBuildingById(building._id, data)
        },
        onSuccess: async () => {
            if (building.company[0] ? building.company[0]._id !== input.company : input.company !== "none") {
                await mutateCompany(input.company !== 'none' ? { "ownedBuildings": [{ "buildingId": building._id }] } : { "ownedBuildings": [{ "buildingId": building._id, "buildingName": "none" }] })
            }
            queryClient.invalidateQueries({ queryKey: ["buildings"] })
            toast.success("Update successful", { theme: "colored", position: "bottom-right" })
        },
        onError: () => {
            toast.error("Error creating building", { theme: "colored", position: "bottom-right" })
        }
    })

    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        if (input.address !== building.address || input.name !== building.name || (building.company[0] ? building.company[0]._id !== input.company : input.company !== "none")) {
            await mutateBuilding({ name: input.name, address: input.address })
            setReloading(true)
            return
        }
        toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
    }

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