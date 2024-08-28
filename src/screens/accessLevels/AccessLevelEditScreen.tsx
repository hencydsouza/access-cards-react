/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"

const AccessLevelEditScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const navigate = useNavigate()
    const [accessLevels, setAccessLevels] = useState<{ name: string, type: string, id: string, description: string, permissions: { resource: string, action: string }[] | [] }>(useLocation().state)
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);

    const [input, setInput] = useState<{ name: string, type: string, id: string, description: string, permissions: { resource: string, action: string }[] | [] }>({
        name: "",
        type: "",
        id: "",
        description: "",
        permissions: []
    })

    const [permissions, setPermissions] = useState<{ resource: string, action: string }>({
        resource: "",
        action: "none"
    })

    useEffect(() => {
        const fetchData = async () => {
            const response = await useApiClient._getWithToken(`/access-level/${params.id}`, auth.accessToken)
            console.log(response.data)
            setAccessLevels(response.data)
            setInput({
                name: response.data.name,
                type: response.data.type,
                id: response.data.id,
                description: response.data.description,
                permissions: response.data.permissions || []
            })
        }

        if (reloading) {
            setReloading(false);
        }

        fetchData()
        setIsLoading(false)
    }, [auth, params.id, reloading, setReloading])


    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        if (input.name !== accessLevels.name || input.type !== accessLevels.type || input.description !== accessLevels.description || !areArraysEqual(input.permissions, accessLevels.permissions)) {
            try {
                // console.log(input)
                const result = await useApiClient._patchWithToken(`/access-level/${accessLevels.id}`,
                    {
                        name: input.name,
                        type: input.type,
                        description: input.description,
                        permissions: input.permissions
                    }, auth.accessToken)
                console.log(result.status)
                toast.success('Update successful', { theme: "colored", position: "bottom-right" })
            } catch (error: any) {
                // // console.log(error.response.data.code)
                // if (error.response.data.code === 400) {
                //     toast.error("Please wait for 5 seconds before updating again", { theme: "colored", position: "bottom-right" })
                // } else
                toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
            }
            setReloading(true)
            return
        }
        toast.error('Please enter update fields', { theme: "colored", position: "bottom-right" })
    }

    const areArraysEqual = (arr1: any[], arr2: any[]) => {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
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

    const handleDelete = async () => {
        try {
            const result = await useApiClient._deleteWithToken(`/access-level/${accessLevels.id}`, auth.accessToken)
            console.log(result.status)
            toast.success('Access Level deleted successfully', { theme: "colored", position: "bottom-right" })
            navigate("/dashboard/access-levels")
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
                            <Breadcrumb link="/dashboard/access-levels" text="Access Levels" />
                            <Breadcrumb state={accessLevels} link={`/dashboard/access-levels/${accessLevels.id}`} text={accessLevels.name} />
                            <Breadcrumb active text="Edit" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">Update Access Level</p>
                    </div>
                </div>

                <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8">
                    <Form onSubmit={handleSubmitEvent} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building Name</Form.Label>
                            <Form.Control required type="text" value={input.name} onChange={handleInput} name="name" placeholder="Enter building name" className="" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Type</Form.Label>
                            {/* <Form.Control required type="text" value={input.type} onChange={handleInput} name="type" placeholder="Enter building name" className="" /> */}
                            <Form.Select required onChange={handleInput} name="type" aria-label="Default select example">
                                <option value="building" selected={input.type === "building" ? true : false} >building</option>
                                <option value="company" selected={input.type === "company" ? true : false} >company</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Description</Form.Label>
                            <Form.Control required type="text" value={input.description} onChange={handleInput} name="description" placeholder="Enter building name" className="" />
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
                                <i className="fa-regular fa-pen-to-square"></i>
                                Update
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