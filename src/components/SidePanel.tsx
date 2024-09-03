import SidePanelElement from "./SidePanelElement"
import { home, building, company, employee, accessCard, accessLog, accessLevel, logout } from '../assets/svg'
import logo from '../assets/logo.svg'
import { useAuth } from "../hooks/AuthProvider"
import { getResource } from "../helpers/checkResource"

const SidePanel = () => {
    const auth = useAuth()

    return (
        <div className="bg-[rgb(20,_114,_230)] min-w-max lg:min-w-[15.5rem] h-screen overflow-y-scroll flex flex-col justify-center sm:rounded-br-[1rem] lg:rounded-br-[3rem] sm:rounded-tr-[1rem] lg:rounded-tr-[3rem] no-scrollbar z-10 shadow-sm" id="dash-side-menu">
            <div className="h-full flex flex-col justify-between items-center text-sm py-2">
                <div className="flex justify-center items-center gap-2 flex-[0_0_4rem]">
                    <img className='w-[2rem]' src={logo} alt="" />
                    <p className='m-0 text-[1.25rem] text-[#FFFFFF] font-bold sm:block hidden'>KeyPass</p>
                </div>

                <div className="self-start px-[0.8rem] sm:px-[2rem] lg:pl-[3rem] sm:m-0 mb-auto relative">
                    <SidePanelElement link="/dashboard" svg={home} text="Dashboard" />
                    {['product', 'building'].some(item => item === getResource()) && <SidePanelElement link="/dashboard/buildings" svg={building} text="Buildings" />}
                    <SidePanelElement link="/dashboard/companies" svg={company} text={getResource() === 'company' ? 'Company' : `Companies`} />
                    <SidePanelElement link="/dashboard/employees" svg={employee} text="Employees" />
                    <SidePanelElement link="/dashboard/access-cards" svg={accessCard} text="Access Cards" />
                    <SidePanelElement link="/dashboard/access-logs" svg={accessLog} text="Access Logs" />
                    <SidePanelElement link="/dashboard/access-levels" svg={accessLevel} text="Access Levels" />
                </div>

                <div className="self-start px-[0.8rem] sm:px-[2rem] lg:pl-[3rem]">
                    {/* <SidePanelElement link="/dashboard/settings" svg={settings} text="Settings" /> */}
                    <SidePanelElement link="/login" onClick={() => { auth.logoutAction() }} svg={logout} text="Logout" />
                </div>

            </div>
        </div>
    )
}

export default SidePanel