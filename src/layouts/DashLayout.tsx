import { Outlet } from "react-router-dom"
import SidePanel from "../components/SidePanel"
import Navbar from "../components/Navbar"

const DashLayout = () => {
    return (
        <section className="flex">
            <SidePanel />
            <div className="flex flex-col w-full">
                <Navbar />
                <div className={`px-[1.5rem] md:px-[2.5rem] lg:px-[4rem] pt-[1.5rem] overflow-scroll max-h-[calc(100vh-3.413rem)] md:max-h-[calc(100vh-4.813rem)] lg:max-h-[calc(100vh-5.125rem)] no-scrollbar`}>
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default DashLayout