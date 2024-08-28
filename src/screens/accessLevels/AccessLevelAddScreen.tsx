/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"

const AccessLevelAddScreen = () => {
    const auth = useAuth()
    const navigate = useNavigate()

    const [input, setInput] = useState<{ name: string, type: string, id: string, description: string, permissions: { resource: string, action: string }[] | [] }>({
        name: "",
        type: "none",
        id: "",
        description: "",
        permissions: []
    })

    const [permissions, setPermissions] = useState<{ resource: string, action: string }>({
        resource: "",
        action: "none"
    })

    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        if (input.name !== "" && input.type !== "none" && input.description !== "" && input.permissions.length > 0) {
            try {
                console.log(input)
                const result = await useApiClient._postWithToken(`/access-level`,
                    {
                        name: input.name,
                        type: input.type,
                        description: input.description,
                        permissions: input.permissions
                    }, auth.accessToken)
                console.log(result.status)
                toast.success('Access level created successfully', { theme: "colored", position: "bottom-right" })
                navigate(`/dashboard/access-levels/${result.data.id}`)
            } catch (error: any) {
                toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
            }
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

    const handlePermissionInput = (e: any) => {
        const { name, value } = e.target
        setPermissions((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddPermission = () => {
        if (permissions.resource !== "" && (permissions.action === "admin" || permissions.action === "access")) {
            setInput((prev) => ({
                ...prev,
                permissions: [
                    ...prev.permissions.filter(p => p.resource !== permissions.resource),
                    {
                        resource: permissions.resource,
                        action: permissions.action
                    }
                ]
            }))
            setPermissions({
                resource: "",
                action: "none"
            })
            return
        }
        toast.error('Please enter valid permission', { theme: "colored", position: "bottom-right" })
    }

    const handleDeletePermission = (resource: string) => {
        setInput((prev) => ({
            ...prev,
            permissions: prev.permissions.filter((permission: { resource: string; action: string }) => permission.resource !== resource)
        }))
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
                <Form onSubmit={handleSubmitEvent} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                        <Form.Control required type="text" onChange={handleInput} name="name" placeholder="Enter building name" className="" />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Type</Form.Label>
                        {/* <Form.Control required type="text" value={input.type} onChange={handleInput} name="type" placeholder="Enter building name" className="" /> */}
                        <Form.Select required onChange={handleInput} name="type" aria-label="Default select example">
                            <option value="none" >Select a type</option>
                            <option value="building" >building</option>
                            <option value="company" >company</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Description</Form.Label>
                        <Form.Control required type="text" onChange={handleInput} name="description" placeholder="Enter building name" className="" />
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
                                {input.permissions.map((permission, index) => (
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
                        <Button type="submit" className="flex  items-center justify-center gap-2">
                            <i className="fa-solid fa-plus"></i>
                            Create
                        </Button>
                    </div>
                </Form>
            </div>
        </ div >
    )
}

export default AccessLevelAddScreen