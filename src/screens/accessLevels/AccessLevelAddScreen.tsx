/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form, Spinner } from "react-bootstrap"
import { IAccessLevelCreate } from "../../types/accessLevel.types"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addAccessLevel } from "../../controllers/accessLevelsController"

type FormFields = IAccessLevelCreate

const AccessLevelAddScreen = () => {
    const navigate = useNavigate()
    const [reload, setReload] = useState(false)

    useEffect(() => {
        if (reload) {
            setReload(false)
        }
    }, [reload])

    const [permissions, setPermissions] = useState<{ resource: string, action: string }>({
        resource: "",
        action: "none"
    })

    const { register, handleSubmit, formState: { isSubmitting }, getValues, setValue } = useForm<FormFields>({
        defaultValues: {
            name: "",
            description: "",
            type: "none",
            permissions: []
        }
    })

    const queryClient = useQueryClient()
    const { mutateAsync: mutateAccessLevels } = useMutation({
        mutationFn: addAccessLevel,
        onSuccess: (newAccessLevel) => {
            queryClient.invalidateQueries({ queryKey: ["accessLevels"] })
            toast.success('Access level created successfully', { theme: "colored", position: "bottom-right" })
            navigate(`/dashboard/access-levels/${newAccessLevel.data.id}`)
        },
        onError: (error) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })


    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        if (data.name !== "" && data.type !== "none" && data.description !== "" && data.permissions.length > 0) {
            await mutateAccessLevels(data)
            return
        }
        toast.error("Please fill all the fields", { theme: "colored", position: "bottom-right" })
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

    return (
        < div >
            <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                <div>
                    <BreadcrumbContainer>
                        <Breadcrumb link="/dashboard/access-levels" text="Access Levels" />
                        <Breadcrumb active text="Add new Access Level" />
                    </BreadcrumbContainer>
                    <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">Add New Access Level</p>
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
                        {/* <Form.Control required type="text" value={input.type} onChange={handleInput} name="type" placeholder="Enter building name" className="" /> */}
                        <Form.Select required {...register("type")} name="type" aria-label="Default select example">
                            <option value="none" >Select a type</option>
                            <option value="building" >building</option>
                            <option value="company" >company</option>
                            <option value="product" >product</option>
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
                                        {/* <Form.Control required type="text" onChange={handleInput} name="name" placeholder="" className="" /> */}
                                        <Form.Select onChange={handlePermissionInput} value={permissions.action} name="action" aria-label="Default select example">
                                            <option value="none">Select type</option>
                                            <option value="access">access</option>
                                            <option value="admin">admin</option>
                                        </Form.Select>

                                    </td>
                                    <td className="py-[0.3rem] px-[0.3rem] md:px-[1.5rem] lg:px-[3rem]">
                                        <Button variant="primary" onClick={handleAddPermission} className="flex  items-center justify-center gap-2">
                                            <i className="fa-solid fa-plus"></i>
                                            {/* Add */}
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
    )
}

export default AccessLevelAddScreen