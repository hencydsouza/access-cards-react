import SidePanelElement from "./SidePanelElement"
import { home, building, company, employee, accessCard, accessLog, accessLevel, settings, logout } from '../assets/svg'
import logo from '../assets/logo.svg'

const SidePanel = () => {
    return (
        <div className="bg-[rgb(20,_114,_230)] min-w-max lg:min-w-[17.5rem] h-screen overflow-y-scroll flex flex-col justify-center sm:rounded-br-[1rem] lg:rounded-br-[3rem] sm:rounded-tr-[1rem] lg:rounded-tr-[3rem] no-scrollbar z-10 shadow-sm" id="dash-side-menu">
            <div className="h-full flex flex-col justify-between items-center text-sm">
                <div className="flex justify-center items-center gap-2 flex-[0_0_4rem]">
                    <img className='w-[2rem]' src={logo} alt="" />
                    <p className='m-0 text-[1.25rem] text-[#FFFFFF] font-bold sm:block hidden'>KeyPass</p>
                </div>

                <div className="self-start px-[0.8rem] sm:px-[2rem] lg:pl-[5rem] sm:m-0 mb-auto relative">
                    <SidePanelElement svg={home} text="Dashboard" active />
                    <SidePanelElement svg={building} text="Buildings" />
                    <SidePanelElement svg={company} text="Companies" />
                    <SidePanelElement svg={employee} text="Employees" />
                    <SidePanelElement svg={accessCard} text="Access Cards" />
                    <SidePanelElement svg={accessLog} text="Access Logs" />
                    <SidePanelElement svg={accessLevel} text="Access Levels" />
                </div>

                <div className="self-start px-[0.8rem] sm:px-[2rem] lg:pl-[5rem]">
                    <SidePanelElement svg={settings} text="Settings" />
                    <SidePanelElement svg={logout} text="Logout" />
                </div>

            </div>
        </div>
    )
}

export default SidePanel