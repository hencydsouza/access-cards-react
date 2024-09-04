/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form, Spinner } from "react-bootstrap"
import { useFetchAccessLevelNames, useFetchBuildingNames, useFetchCompanyNames } from "../../hooks/useFetchQueries"
import { SubmitHandler, useForm } from "react-hook-form"
import { IEmployeeCreate } from "../../types/employees.types"
import { addEmployee } from "../../controllers/employeeController"
import { useMutation } from "@tanstack/react-query"

const EmployeeAddScreen = () => {
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
    const [reload, setReload] = useState(false)

    const { data: companyNamesData, status: companyNamesStatus } = useFetchCompanyNames()
    const { data: buildingNamesData, status: buildingNamesStatus } = useFetchBuildingNames()
    const { data: accessLevelNamesData, status: accessLevelNamesStatus } = useFetchAccessLevelNames()

    useEffect(() => {
        if (reload) {
            setReload(false)
        }
    }, [reload])

    useEffect(() => {
        if (companyNamesStatus === "success" && buildingNamesStatus === "success" && accessLevelNamesStatus === "success") {
            setCompanyNames(companyNamesData)
            setBuildingNames(buildingNamesData)
            setAccessLevelNames(accessLevelNamesData)
            setIsLoading(false)
        }
    }, [companyNamesData, buildingNamesData, accessLevelNamesData, companyNamesStatus, buildingNamesStatus, accessLevelNamesStatus])

    const { register, handleSubmit, formState: { isSubmitting }, getValues, setValue } = useForm<IEmployeeCreate>({
        defaultValues: {
            buildingId: "none",
            companyId: "none",
            accessLevels: []
        }
    })

    // const handleSubmitEvent = async (e: any) => {
    //     e.preventDefault();
    //     if (input.name !== "" || input.buildingId !== "none" || input.companyId !== "none" || input.email !== "" || input.accessLevels.length !== 0) {
    //         try {
    //             console.log(input)
    //             const result = await useApiClient._postWithToken(`/employee/`, {
    //                 name: input.name,
    //                 email: input.email,
    //                 buildingId: input.buildingId,
    //                 companyId: input.companyId,
    //                 accessLevels: input.accessLevels
    //             }, auth.accessToken)
    //             console.log(result.status)
    //             toast.success('Employee created successfully', { theme: "colored", position: "bottom-right" })
    //             navigate(`/dashboard/employees/${result.data.id}`)
    //         } catch (error: any) {
    //             toast.error(error.response.data.message, { theme: "colored", position: "bottom-right" })
    //         }
    //         return
    //     }
    //     toast.error('Please enter all fields', { theme: "colored", position: "bottom-right" })
    // }

    // const { mutateAsync: mutateCompany } = useMutation({
    //     mutationFn: addCompany,
    //     onSuccess: (newCompany) => {
    //         toast.success('Company created successfully', { theme: "colored", position: "bottom-right" })
    //         navigate(`/dashboard/companies/${newCompany.data.id}`)
    //     },
    //     onError: (error) => {
    //         toast.error(error.message, { theme: "colored", position: "bottom-right" })
    //     }
    // })

    const { mutateAsync: mutateEmployee } = useMutation({
        mutationFn: addEmployee,
        onSuccess: (newEmployee) => {
            toast.success('Employee created successfully', { theme: "colored", position: "bottom-right" })
            navigate(`/dashboard/employees/${newEmployee.data.id}`)
        },
        onError: (error) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const onSubmit: SubmitHandler<IEmployeeCreate> = async (data: IEmployeeCreate) => {
        if (data.name !== "" || data.buildingId !== "none" || data.companyId !== "none" || data.email !== "" || data.accessLevels.length !== 0) {
            // await mutateCompany({ name: data.name, address: data.address })
            await mutateEmployee(data)
            return
        }
        toast.error("Please fill all the fields", { theme: "colored", position: "bottom-right" })
    }

    const handleAccessLevelInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const currentValues = getValues(name as keyof IEmployeeCreate) as { accessLevel: string }[]
        if (!currentValues.some(accessLevel => accessLevel.accessLevel === value)) {
            const updatedValues = [...currentValues, { accessLevel: value }]
            setValue(name as keyof IEmployeeCreate, updatedValues)
        }
        setReload(true)
        e.target.value = "none"
    }

    const handleAccessLevelRemoval = (e: any) => {
        const currentValues = getValues('accessLevels') as { accessLevel: string }[]
        const updatedValues = currentValues.filter(accessLevel => accessLevel.accessLevel !== e.target.id)
        setValue('accessLevels', updatedValues)
        setReload(true)
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
                    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1rem] md:gap-[1.5rem]">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Name</Form.Label>
                            <Form.Control required type="text" {...register("name")} name="name" placeholder="Enter employee name" className="" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Email</Form.Label>
                            <Form.Control required type="email" {...register("email")} name="email" placeholder="Enter employee name" className="" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="text-[0.875rem] font-medium text-[#344054] mb-[0.5rem]">Company</Form.Label>
                            <Form.Select required {...register("companyId")} name="companyId" aria-label="Default select example">
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
                            <Form.Select required {...register("buildingId")} name="buildingId" aria-label="Default select example">
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

                        <div className={"flex gap-2" + (getValues("accessLevels").length > 0 ? " flex-wrap" : " hidden")}>
                            {
                                getValues("accessLevels").length > 0
                                    ? getValues("accessLevels").map((item, index) =>
                                        <Button onClick={handleAccessLevelRemoval} className="bg-[#e8f1fd] text-[#0b3f7f] flex items-center gap-2" key={index} id={item.accessLevel}>{accessLevelNames.find((name) => name.id === item.accessLevel)?.name} <i className="fa-solid fa-xmark text-[#d7373f]"></i></Button>
                                    )
                                    : <div></div>
                            }
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button disabled={isSubmitting} type="submit" className="flex  items-center justify-center gap-2">
                                <i className={`fa-solid fa-plus ${isSubmitting ? "hidden" : ""}`}></i>
                                {
                                    isSubmitting ? <Spinner animation="border" size="sm" /> : "Create"
                                }
                            </Button>
                        </div>
                    </Form>
                </div>
            </ div >
        ) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default EmployeeAddScreen