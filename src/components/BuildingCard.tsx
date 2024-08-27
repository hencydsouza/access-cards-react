import { Button } from "react-bootstrap"
// import { buildingBlack, eye } from "../assets/svg"
import { LinkContainer } from "react-router-bootstrap"
import { eye } from "../assets/svg"


const BuildingCard = (props: { state: { name: string; _id: string; address: string; company: { name: string; }[]; } }) => {
    const { state } = props
    return (
        <div className="bg-white rounded-[1.5rem] border border-[#e8f1fc]">
            <div className="p-6 sm:p-8 flex justify-between h-full">
                <div className="flex flex-col gap-[1rem]">
                    <p className="lg:text-[1.4rem] font-extrabold text-[#2C2C2C] md:text-[1.2rem] text-[1.1rem]">{state.name}</p>
                    <div>
                        <p className="lg:text-[0.8rem] text-[rgb(11,_63,_127)] md:text-[0.7rem] text-[0.6rem]">Owned By</p>
                        <p className="lg:text-[1rem] font-medium text-[#4B4B4B] md:text-[0.95rem] text-[0.75rem]">{state.company[0] ? state.company[0].name : "Unowned"}</p>
                    </div>
                    <div>
                        <p className="lg:text-[0.8rem] text-[rgb(11,_63,_127)] md:text-[0.7rem] text-[0.6rem]">Location</p>
                        <p className="lg:text-[1rem] font-medium text-[#4B4B4B] md:text-[0.95rem] text-[0.75rem]">{state.address}</p>
                    </div>
                    <LinkContainer to={`/dashboard/buildings/edit/${state._id}`} state={state}>
                        <Button variant="outline-primary" className="w-max flex items-center gap-2 mt-auto">
                            <i className="fa-regular fa-pen-to-square"></i>
                            Edit
                        </Button>
                    </LinkContainer>
                </div>
                {/* <div className="card-content-button-container hidden sm:block">
                    {buildingBlack}
                </div> */}
                <LinkContainer to={`${state._id}`} className="cursor-pointer h-[18px] sm:h-[24px] min-w-[24px]" state={state}>
                    {eye}
                </LinkContainer>
            </div>
        </div>
    )
}

export default BuildingCard