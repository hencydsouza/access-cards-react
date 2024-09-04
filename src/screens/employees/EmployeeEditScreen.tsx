/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BreadcrumbContainer from "../../components/BreadcrumbContainer"
import Breadcrumb from "../../components/Breadcrumb"
import { Button, Form, Spinner } from "react-bootstrap"
import { useFetchAccessLevelNames, useFetchBuildingNames, useFetchCompanyNames, useFetchEmployeeById } from "../../hooks/useFetchQueries"
import { SubmitHandler, useForm } from "react-hook-form"
import { IEmployeeCreate } from "../../types/employees.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteEmployee, updateEmployee } from "../../controllers/employeeController"
import { IAccessLevelNames, IBuildingNames, ICompanyNames } from "../../types/form.types"

type FormFields = IEmployeeCreate

const EmployeeEditScreen = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [employee, setEmployee] = useState<{ name: string, id: string, email: string, company: { buildingId: string, companyId: string }, permissions: { resource: string, action: string, type: string }[], accessLevels: { accessLevel: string }[] }>(useLocation().state)
    const [buildingNames, setBuildingNames] = useState<IBuildingNames[]>([])
    const [companyNames, setCompanyNames] = useState<Partial<ICompanyNames>[]>([])
    const [accessLevelNames, setAccessLevelNames] = useState<IAccessLevelNames[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [reloading, setReloading] = useState(false);

    const { data: employeeData, status: employeeStatus } = useFetchEmployeeById(params.id!)
    const { data: buildingNamesData, status: buildingNamesStatus } = useFetchBuildingNames()
    const { data: companyNamesData, status: companyNamesStatus } = useFetchCompanyNames()
    const { data: accessLevelNamesData, status: accessLevelNamesStatus } = useFetchAccessLevelNames()

    const { register, handleSubmit, formState: { isSubmitting }, getValues, setValue } = useForm<FormFields>()

    useEffect(() => {
        if (reloading) {
            setReloading(false)
        }
    }, [reloading])

    useEffect(() => {
        if (employeeStatus === 'success' && buildingNamesStatus === 'success' && companyNamesStatus === 'success' && accessLevelNamesStatus === 'success') {
            setEmployee(employeeData)
            setValue("name", employeeData.name)
            setValue("email", employeeData.email)
            setValue("buildingId", employeeData.company.buildingId)
            setValue("companyId", employeeData.company.companyId)
            setValue("accessLevels", employeeData.accessLevels)
            setBuildingNames(buildingNamesData)
            setCompanyNames(companyNamesData)
            setAccessLevelNames(accessLevelNamesData)
            setIsLoading(false)
        }
    }, [
        setValue,
        employeeData,
        buildingNamesStatus,
        companyNamesStatus,
        accessLevelNamesStatus,
        employeeStatus,
        buildingNamesData,
        companyNamesData,
        accessLevelNamesData
    ])

    const queryClient = useQueryClient();
    const { mutateAsync: mutateEmployee } = useMutation({
        mutationFn: (data: FormFields) => {
            return updateEmployee(employee.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] })
            toast.success('Employee updated successfully', { theme: "colored", position: "bottom-right" })
        },
        onError: (error) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const { mutateAsync: deleteEmployeeFunc } = useMutation({
        mutationFn: deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] })
            toast.success('Employee deleted successfully', { theme: "colored", position: "bottom-right" })
            navigate("/dashboard/employees")
        },
        onError: (error) => {
            toast.error(error.message, { theme: "colored", position: "bottom-right" })
        }
    })

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        if (data.name !== employee.name || data.buildingId !== employee.company.buildingId || data.companyId !== employee.company.companyId || data.email !== employee.email || !areArraysEqual(data.accessLevels, employee.accessLevels)) {
            await mutateEmployee(data)
            return
        }
        toast.error("Please fill all the fields", { theme: "colored", position: "bottom-right" })
    }

    const areArraysEqual = (arr1: any[], arr2: any[]) => {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((item, index) => item === arr2[index]);
    }

    const handleAccessLevelInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const currentValues = getValues(name as keyof IEmployeeCreate) as { accessLevel: string }[]
        if (!currentValues.some(accessLevel => accessLevel.accessLevel === value)) {
            const updatedValues = [...currentValues, { accessLevel: value }]
            setValue(name as keyof IEmployeeCreate, updatedValues)
        }
        setReloading(true)
        e.target.value = "none"
    }

    const handleAccessLevelRemoval = (e: any) => {
        const currentValues = getValues('accessLevels') as { accessLevel: string }[]
        const updatedValues = currentValues.filter(accessLevel => accessLevel.accessLevel !== e.target.id)
        setValue('accessLevels', updatedValues)
        setReloading(true)
    }

    const handleDelete = async () => {
        await deleteEmployeeFunc(employee.id)
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
                            <Button type="submit" className="flex  items-center justify-center gap-2">
                                <i className={`fa-regular fa-pen-to-square ${isSubmitting ? "hidden" : ""}`}></i>
                                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Update"}
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