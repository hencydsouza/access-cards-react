import { Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { eye } from "../assets/svg"

const EmployeeCard = (props: { state: { name: string, id: string, email: string, company: { buildingId: string, companyId: string }, permissions: { resource: string, action: string, type: string }[], accessLevels: { accessLevel: string }[] }, companyNames: { name: string, _id: string }[] }) => {
    const { state, companyNames } = props

    return (
        <div className="bg-white rounded-[1.5rem] border border-[#e8f1fc]">
            <div className="p-6 sm:p-8 flex justify-between h-full">
                <div className="flex flex-col gap-[1rem]">
                    <p className="lg:text-[1.4rem] font-extrabold text-[#2C2C2C] md:text-[1.2rem] text-[1.1rem]">{state.name}</p>
                    <div>
                        <p className="lg:text-[0.8rem] text-[rgb(11,_63,_127)] md:text-[0.7rem] text-[0.6rem]">Email</p>
                        <p className="lg:text-[1rem] font-medium text-[#4B4B4B] md:text-[0.95rem] text-[0.75rem]">{state.email}</p>
                    </div>
                    <div>
                        <p className="lg:text-[0.8rem] text-[rgb(11,_63,_127)] md:text-[0.7rem] text-[0.6rem]">Company</p>
                        <p className="lg:text-[1rem] font-medium text-[#4B4B4B] md:text-[0.95rem] text-[0.75rem]">{companyNames.find((item) => state.company.companyId === item._id)?.name}</p>
                    </div>
                    {/* <div>
                        <p className="lg:text-[0.8rem] text-[rgb(11,_63,_127)] md:text-[0.7rem] text-[0.6rem]">Building</p>
                        <p className="lg:text-[1rem] font-medium text-[#4B4B4B] md:text-[0.95rem] text-[0.75rem]">{buildingNames.find((item) => state.company.buildingId === item.id)?.name}</p>
                    </div> */}
                    {/* <div>
                        <p className="lg:text-[0.8rem] text-[rgb(11,_63,_127)] md:text-[0.7rem] text-[0.6rem]">Description</p>
                        <p className="lg:text-[1rem] font-medium text-[#4B4B4B] md:text-[0.95rem] text-[0.75rem]">{state.description}</p>
                    </div> */}
                    <LinkContainer to={`/dashboard/employees/edit/${state.id}`} state={state}>
                        <Button variant="outline-primary" className="w-max text-sm border-none bg-[#e8f1fd] flex items-center gap-2 mt-auto">
                            <i className="fa-regular fa-pen-to-square"></i>
                            Edit
                        </Button>
                    </LinkContainer>
                </div>
                {/* <div className="card-content-button-container hidden sm:block">
                    {buildingBlack}
                </div> */}
                <LinkContainer to={`${state.id}`} className="cursor-pointer h-[18px] sm:h-[24px] min-w-[24px]" state={state}>
                    {eye}
                </LinkContainer>
            </div>
        </div>
    )
}

export default EmployeeCard