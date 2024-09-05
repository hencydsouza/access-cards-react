/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form, Spinner } from "react-bootstrap"
import { useFetchAccessLevelById } from "../../hooks/useFetchQueries"
import { SubmitHandler, useForm } from "react-hook-form"
import { IAccessLevelCreate } from "../../types/accessLevel.types"
import { deleteAccessLevelById, updateAccessLevel } from "../../controllers/accessLevelsController"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type FormFields = IAccessLevelCreate

const AccessLevelEditScreen = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [accessLevels, setAccessLevels] = useState<{ name: string, type: string, id: string, description: string, permissions: { resource: string, action: string }[] | [] }>(useLocation().state)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(false);

    const [permissions, setPermissions] = useState<{ resource: string, action: string }>({
        resource: "",
        action: "none"
    })

    const { data, status } = useFetchAccessLevelById(params.id!)
    const { register, handleSubmit, formState: { isSubmitting }, getValues, setValue } = useForm<FormFields>({
        defaultValues: {
            name: "",
            description: "",
            type: "none",
            permissions: []
        }
    })

    useEffect(() => {
        if (reload) {
            setReload(false)
        }
    }, [reload])

    useEffect(() => {
        if (status === "success") {
            setAccessLevels(data)
            setValue("name", data.name)
            setValue("description", data.description)
            setValue("type", data.type)
            setValue("permissions", data.permissions)
            setIsLoading(false)
        }
    }, [data, status, setValue])

    const queryClient = useQueryClient()
    const { mutateAsync: mutateAccessLevels } = useMutation({
        mutationFn: (data: FormFields) => {
            return updateAccessLevel(accessLevels.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accessLevels"] })
            toast.success('Access level updated successfully', { theme: "colored", position: "bottom-right" })
        },
        onError: (error) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (data.name !== accessLevels.name || data.type !== accessLevels.type || data.description !== accessLevels.description || !areArraysEqual(data.permissions, accessLevels.permissions)) {
            await mutateAccessLevels(data)
            return
        }
        toast.error("Please fill all the fields", { theme: "colored", position: "bottom-right" })
    }

    const areArraysEqual = (arr1: any[], arr2: any[]) => {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    const handlePermissionInput = (e: any) => {
        const { name, value } = e.target
        setPermissions((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddPermission = () => {
        if (permissions.resource !== "" && (permissions.action === "admin" || permissions.action === "access")) {
            setValue("permissions", [
                ...getValues("permissions").filter(p => p.resource !== permissions.resource),
                {
                    resource: permissions.resource,
                    action: permissions.action
                }

            ])
            setPermissions({
                resource: "",
                action: "none"
            })
            return
        }
        toast.error('Please enter valid permission', { theme: "colored", position: "bottom-right" })
    }

    const handleDeletePermission = (resource: string) => {
        setValue("permissions", getValues("permissions").filter((p: { resource: string; action: string }) => p.resource !== resource))
        setReload(true)
    }

    const { mutateAsync: deleteAccessLevel } = useMutation({
        mutationFn: deleteAccessLevelById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accessLevels'] })
            toast.success('Access level deleted successfully', { theme: "colored", position: "bottom-right" })
            navigate('/dashboard/access-levels')
        },
        onError: (error: any) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const handleDelete = async () => {
        await deleteAccessLevel(accessLevels.id)
    }

    return (
        !isLoading ? (
            < div >
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb link="/dashboard/access-levels" text="Access Levels" />
                            <Breadcrumb state={accessLevels} link={`/dashboard/access-levels/${accessLevels.id}`} text={accessLevels.name} />
                            <Breadcrumb active text="Edit" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">Update Access Level</p>
                    </div>
                </div>

                <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8">
                    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                            <Form.Control required type="text" {...register("name")} name="name" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Type</Form.Label>
                            <Form.Select required {...register("type")} aria-label="Default select example">
                                <option value="building" >building</option>
                                <option value="company" >company</option>
                                <option value="company">product</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Description</Form.Label>
                            <Form.Control required type="text" {...register("description")} name="description" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <div className="relative overflow-x-auto sm:rounded-lg mt-2 border-2 border-[#e8f1fd] w-full md:w-max">
                            <table className="w-full md:w-auto text-sm text-left rtl:text-right">
                                <thead className="text-xs bg-[#E8F1FD] text-[#0B3F7F]">
                                    <tr>
                                        <th scope="col" className="py-[0.813rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem]">Resource</th>
                                        <th scope="col" className="py-[0.813rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem]">Action</th>
                                        <th scope="col" className="py-[0.813rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getValues("permissions").map((permission, index) => (
                                        <tr key={index} className="text-black">
                                            <th scope="row" className="font-medium whitespace-nowrap py-[0.5rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem] text-wrap md:text-nowrap">{permission.resource}</th>
                                            <td className="py-[0.3rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem]">{permission.action}</td>
                                            <td className="py-[0.3rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem]">
                                                <Button variant="danger" onClick={() => handleDeletePermission(permission.resource)} className="flex items-center justify-center gap-2">
                                                    <i className="fa-solid fa-trash"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="text-black">
                                        <th className="py-[0.3rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem]">
                                            <Form.Control type="text" value={permissions.resource} name="resource" onChange={handlePermissionInput} placeholder="Permission" className="" />
                                        </th>
                                        <td className="py-[0.3rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem]">
                                            <Form.Select onChange={handlePermissionInput} value={permissions.action} name="action" aria-label="Default select example">
                                                <option value="none">Select type</option>
                                                <option value="access">access</option>
                                                <option value="admin">admin</option>
                                            </Form.Select>

                                        </td>
                                        <td className="py-[0.3rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem]">
                                            <Button variant="primary" onClick={handleAddPermission} className="flex  items-center justify-center gap-2">
                                                <i className="fa-solid fa-plus"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button disabled={isSubmitting} type="submit" className="flex  items-center justify-center gap-2">
                                <i className={`fa-regular fa-pen-to-square ${isSubmitting ? "hidden" : ""}`}></i>
                                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Update"}
                            </Button>

                            <Button onClick={() => {
                                if (window.confirm("Are you sure you want to delete this access level?")) {
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

export default AccessLevelEditScreen