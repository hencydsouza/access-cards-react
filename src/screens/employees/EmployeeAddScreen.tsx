/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"

const EmployeeAddScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const navigate = useNavigate()
    const [buildingNames, setBuildingNames] = useState<{ name: string, id: string }[]>([{
        name: "",
        id: ""
    }])
    const [companyNames, setCompanyNames] = useState<{ name: string, _id: string }[]>([{
        name: "name",
        _id: "_id"
    }])
    const [accessLevelNames, setAccessLevelNames] = useState<{ name: string, id: string }[]>([{
        name: "",
        id: ""
    }])
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);

    const [input, setInput] = useState<{ name: string, email: string, buildingId: string, companyId: string, accessLevels: { accessLevel: string }[] | [] }>({
        name: "",
        email: "",
        buildingId: "none",
        companyId: "none",
        accessLevels: []
    })

    useEffect(() => {
        const fetchBuildingNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/building/buildingNames', auth.accessToken)
                setBuildingNames(response.data)
            } catch (error) {
                console.error('Error fetching building names:', error)
            }
        }
        const fetchCompanyNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/company/companyNames', auth.accessToken)
                setCompanyNames(response.data)
            } catch (error) {
                console.error('Error fetching company names:', error)
            }
        }
        const fetchAccessLevelNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/access-level/accessLevelNames', auth.accessToken)
                setAccessLevelNames(response.data)
            } catch (error) {
                console.error('Error fetching access level names:', error)
            }
        }

        const fetchAllData = async () => {
            await Promise.all([
                fetchBuildingNames(),
                fetchCompanyNames(),
                fetchAccessLevelNames()
            ])
            setIsLoading(false)
        }

        if (reloading) {
            setReloading(false)
            fetchAllData()
        } else {
            fetchAllData()
        }
    }, [auth, params.id, reloading, setReloading])


    const handleSubmitEvent = async (e: any) => {
        e.preventDefault();
        if (input.name !== "" || input.buildingId !== "none" || input.companyId !== "none" || input.email !== "" || input.accessLevels.length !== 0) {
            try {
                console.log(input)
                const result = await useApiClient._postWithToken(`/employee/`, {
                    name: input.name,
                    email: input.email,
                    buildingId: input.buildingId,
                    companyId: input.companyId,
                    accessLevels: input.accessLevels
                }, auth.accessToken)
                console.log(result.status)
                toast.success('Employee created successfully', { theme: "colored", position: "bottom-right" })
                navigate(`/dashboard/employees/${result.data.id}`)
            } catch (error: any) {
                toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
            }
            return
        }
        toast.error('Please enter all fields', { theme: "colored", position: "bottom-right" })
    }

    const handleInput = (e: any) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAccessLevelInput = (e: any) => {
        const { name, value } = e.target
        setInput((prev: any) => ({
            ...prev,
            [name]: prev[name].length
                ? prev[name].some((item: { accessLevel: string }) => item.accessLevel === value) ? [...prev[name]] : [...prev[name], { accessLevel: value }]
                : [{ accessLevel: value }]
        }))
        e.target.value = "none"
    }

    const handleAccessLevelRemoval = (e: any) => {
        setInput((prev: any) => ({
            ...prev,
            ["accessLevels"]: prev["accessLevels"].filter((accessLevels: { accessLevel: string }) => accessLevels.accessLevel !== e.target.id)
        }))
    }

    return (
        !isLoading ? (
            < div >
                <div className="flex items-start gap-3 md:items-center justify-between flex-col md:flex-row">
                    <div>
                        <BreadcrumbContainer>
                            <Breadcrumb link="/dashboard/employees" text="Employees" />
                            <Breadcrumb active text="Add New Employee" />
                        </BreadcrumbContainer>
                        <p className="text-[0.7rem] md:text-[1rem] font-medium text-[#B3B3B3] m-0">Update employee</p>
                    </div>
                </div>

                <div className="bg-white px-[1rem] md:px-[2rem] py-[2rem] rounded-[1.5rem] border border-[#e8f1fc] mt-8">
                    <Form onSubmit={handleSubmitEvent} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Name</Form.Label>
                            <Form.Control required type="text" value={input.name} onChange={handleInput} name="name" placeholder="Enter employee name" className="" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Email</Form.Label>
                            <Form.Control required type="email" value={input.email} onChange={handleInput} name="email" placeholder="Enter employee name" className="" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Company</Form.Label>
                            <Form.Select required onChange={handleInput} name="companyId" aria-label="Default select example">
                                <option value="none" >Select a company</option>
                                {
                                    companyNames.map((companyName, index) => {
                                        return <option key={index} value={companyName._id} >{companyName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building</Form.Label>
                            <Form.Select required onChange={handleInput} name="buildingId" aria-label="Default select example">
                                <option value="none" >Select a building</option>
                                {
                                    buildingNames.map((buildingName, index) => {
                                        return <option key={index} value={buildingName.id} >{buildingName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>


                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Access Levels</Form.Label>
                            <Form.Select required onChange={handleAccessLevelInput} defaultValue="none" name="accessLevels" aria-label="Default select example">
                                <option value="none">Select a access level to add</option>
                                {
                                    accessLevelNames.map((accessLevelName, index) => {
                                        return <option key={index} value={accessLevelName.id} >{accessLevelName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>

                        <div className={"flex gap-2" + (input.accessLevels.length > 0 ? " flex-wrap" : " hidden")}>
                            {
                                input.accessLevels.length > 0
                                    ? input.accessLevels.map((item, index) =>
                                        <Button onClick={handleAccessLevelRemoval} className="bg-[#e8f1fd] text-[#0b3f7f] flex items-center gap-2" key={index} id={item.accessLevel}>{accessLevelNames.find((name) => name.id === item.accessLevel)?.name} <i className="fa-solid fa-xmark text-[#d7373f]"></i></Button>
                                    )
                                    : <div></div>
                            }
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
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default EmployeeAddScreen