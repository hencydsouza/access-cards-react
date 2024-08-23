import { Button } from "react-bootstrap"
import { buildingBlack } from "../assets/svg"

const BuildingCard = (props: { buildingName: string, buildingOwner: string, buildingLocation: string }) => {
    const { buildingName, buildingOwner, buildingLocation, } = props
    return (
        <div className="bg-white rounded-[1.5rem] border border-[#e8f1fc]">
            <div className="p-6 sm:p-8 flex justify-between h-full">
                <div className="flex flex-col gap-[1rem]">
                    <p className="lg:text-[1.75rem] font-extrabold text-[#2C2C2C] md:text-[1.55rem] text-[1.35rem]">{buildingName}</p>
                    <div>
                        <p className="lg:text-[1rem] text-[rgb(11,_63,_127)] md:text-[0.8rem] text-[0.6rem]">Owned By</p>
                        <p className="lg:text-[1.25rem] font-medium text-[#4B4B4B] md:text-[1.05rem] text-[0.85rem]">{buildingOwner}</p>
                    </div>
                    <div>
                        <p className="lg:text-[1rem] text-[rgb(11,_63,_127)] md:text-[0.8rem] text-[0.6rem]">Location</p>
                        <p className="lg:text-[1.25rem] font-medium text-[#4B4B4B] md:text-[1.05rem] text-[0.85rem]">{buildingLocation}</p>
                    </div>
                    <Button variant="outline-primary" className="w-max flex items-center gap-2 mt-auto">
                        <i className="fa-regular fa-pen-to-square"></i>
                        Edit
                    </Button>
                </div>
                <div className="card-content-button-container hidden sm:block">
                    {buildingBlack}
                </div>
            </div>
        </div>
    )
}

export default BuildingCard