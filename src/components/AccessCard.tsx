import { Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { eye } from "../assets/svg"

const AccessCard = (props: { state: { cardHolder: { buildingId: string, companyId: string, employeeId: string }, cardNumber: string, id: string, is_active: boolean, issued_at: string, valid_until: string | null }, companyNames: { name: string, _id: string }[], buildingNames: { name: string, id: string }[], employeeNames: { name: string, id: string }[] }) => {
    const { state, companyNames, buildingNames, employeeNames } = props

    return (
        <div className="bg-white rounded-[1.5rem] border border-[#e8f1fc]">
            <div className="p-6 sm:p-8 flex justify-between h-full">
                <div className="flex flex-col gap-[1rem]">
                    <p className="lg:text-[1.4rem] font-extrabold text-[#2C2C2C] md:text-[1.2rem] text-[1.1rem]">{state.cardNumber}</p>
                    <div>
                        <p className="lg:text-[0.8rem] text-[rgb(11,_63,_127)] md:text-[0.7rem] text-[0.6rem]">Name</p>
                        <p className="lg:text-[1rem] font-medium text-[#4B4B4B] md:text-[0.95rem] text-[0.75rem]">{employeeNames.find((item) => item.id === state.cardHolder.employeeId)?.name}</p>
                    </div>
                    <div>
                        <p className="lg:text-[0.8rem] text-[rgb(11,_63,_127)] md:text-[0.7rem] text-[0.6rem]">Company</p>
                        <p className="lg:text-[1rem] font-medium text-[#4B4B4B] md:text-[0.95rem] text-[0.75rem]">{companyNames.find((item) => item._id === state.cardHolder.companyId)?.name}</p>
                    </div>
                    <div>
                        <p className="lg:text-[0.8rem] text-[rgb(11,_63,_127)] md:text-[0.7rem] text-[0.6rem]">Building</p>
                        <p className="lg:text-[1rem] font-medium text-[#4B4B4B] md:text-[0.95rem] text-[0.75rem]">{buildingNames.find((item) => item.id === state.cardHolder.buildingId)?.name}</p>
                    </div>
                    <LinkContainer to={`/dashboard/access-cards/edit/${state.id}`} state={state}>
                        <Button variant="outline-primary" className="w-max flex items-center gap-2 mt-auto">
                            <i className="fa-regular fa-pen-to-square"></i>
                            Edit
                        </Button>
                    </LinkContainer>
                </div>
                <LinkContainer to={`${state.id}`} className="cursor-pointer h-[18px] sm:h-[24px] min-w-[24px]" state={state}>
                    {eye}
                </LinkContainer>
            </div>
        </div>
    )
}

export default AccessCard