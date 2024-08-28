/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useEffect, useState } from "react"
import useApiClient from "../../hooks/ApiClient"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form } from "react-bootstrap"

const EmployeeEditScreen = () => {
    const auth = useAuth()
    const params = useParams()
    const navigate = useNavigate()
    const [employee, setEmployee] = useState<{ name: string, id: string, email: string, company: { buildingId: string, companyId: string }, permissions: { resource: string, action: string, type: string }[], accessLevels: { accessLevel: string }[] }>(useLocation().state)
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
        buildingId: "",
        companyId: "",
        accessLevels: []
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useApiClient._getWithToken(`/employee/${params.id}`, auth.accessToken)
                setEmployee(response.data)
                setInput({
                    name: response.data.name,
                    buildingId: response.data.company.buildingId,
                    companyId: response.data.company.companyId,
                    email: response.data.email,
                    accessLevels: response.data.accessLevels
                })
            } catch (error) {
                console.error('Error fetching employee data:', error)
                toast.error('Failed to fetch employee data')
            }
        }
        const fetchBuildingNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/building/buildingNames', auth.accessToken)
                setBuildingNames(response.data)
            } catch (error) {
                console.error('Error fetching building names:', error)
                toast.error('Failed to fetch building names')
            }
        }
        const fetchCompanyNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/company/companyNames', auth.accessToken)
                setCompanyNames(response.data)
            } catch (error) {
                console.error('Error fetching company names:', error)
                toast.error('Failed to fetch company names')
            }
        }
        const fetchAccessLevelNames = async () => {
            try {
                const response = await useApiClient._getWithToken('/access-level/accessLevelNames', auth.accessToken)
                setAccessLevelNames(response.data)
            } catch (error) {
                console.error('Error fetching access level names:', error)
                toast.error('Failed to fetch access level names')
            }
        }

        const fetchAllData = async () => {
            await Promise.all([
                fetchData(),
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
        if (input.name !== employee.name || input.buildingId !== employee.company.buildingId || input.companyId !== employee.company.companyId || input.email !== employee.email || !areArraysEqual(input.accessLevels, employee.accessLevels)) {
            try {
                console.log(input)
                const result = await useApiClient._patchWithToken(`/employee/${employee.id}`, {
                    name: input.name,
                    email: input.email,
                    buildingId: input.buildingId,
                    companyId: input.companyId,
                    accessLevels: input.accessLevels
                }, auth.accessToken)
                console.log(result.status)
                toast.success('Update successful', { theme: "colored", position: "bottom-right" })
            } catch (error: any) {
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

    const handleAccessLevelInput = (e: any) => {
        const { name, value } = e.target
        setInput((prev: any) => ({
            ...prev,
            [name]: prev[name].length
                ? prev[name].some((item: { accessLevel: string }) => item.accessLevel === value) ? [...prev[name]] : [...prev[name], { accessLevel: value }]
                : [{ accessLevel: value }]
        }))
        e.target.value = "none"
        // console.log(input)
    }

    const handleAccessLevelRemoval = (e: any) => {
        setInput((prev: any) => ({
            ...prev,
            ["accessLevels"]: prev["accessLevels"].filter((accessLevels: { accessLevel: string }) => accessLevels.accessLevel !== e.target.id)
        }))
    }

    const handleDelete = async () => {
        try {
            const result = await useApiClient._deleteWithToken(`/employee/${employee.id}`, auth.accessToken)
            console.log(result.status)
            toast.success('employee deleted successfully', { theme: "colored", position: "bottom-right" })
            navigate("/dashboard/employees")
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
                            <Breadcrumb link="/dashboard/employees" text="Employees" />
                            <Breadcrumb state={employee} link={`/dashboard/employees/${employee.id}`} text={employee.name} />
                            <Breadcrumb active text="Edit" />
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
                            <Form.Control required type="text" value={input.email} onChange={handleInput} name="email" placeholder="Enter employee name" className="" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Company</Form.Label>
                            <Form.Select required onChange={handleInput} name="companyId" aria-label="Default select example">
                                {
                                    companyNames.map((companyName, index) => {
                                        return <option key={index} selected={employee.company.companyId === companyName._id ? true : false} value={companyName._id} >{companyName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Building</Form.Label>
                            <Form.Select required onChange={handleInput} name="buildingId" aria-label="Default select example">
                                {
                                    buildingNames.map((buildingName, index) => {
                                        return <option key={index} selected={employee.company.buildingId === buildingName.id ? true : false} value={buildingName.id} >{buildingName.name}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>


                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Buildings Owned</Form.Label>
                            <Form.Select required onChange={handleAccessLevelInput} defaultValue="none" name="accessLevels" aria-label="Default select example">
                                <option value="none">Select a access level to add</option>
                                {
                                    accessLevelNames.map((accessLevelName, index) => {
                                        // selected={building.company[0] && (building.company[0]._id === accessLevelName._id) ? true : false}
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
                                <i className="fa-regular fa-pen-to-square"></i>
                                Update
                            </Button>

                            <Button onClick={() => {
                                if (window.confirm("Are you sure you want to delete this employee?")) {
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

export default EmployeeEditScreen