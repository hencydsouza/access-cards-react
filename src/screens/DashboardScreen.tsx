import { Tooltip } from "react-bootstrap"
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"
import { eye } from "../assets/svg"
import DashboardCard from "../components/DashboardCard"
import BreadcrumbContainer from "../components/BreadcrumbContainer"
import Breadcrumb from "../components/Breadcrumb"

const DashboardScreen = () => {
    const accessActivity = [
        { date: "6d", logs: 120 },
        { date: "5d", logs: 200 },
        { date: "4d", logs: 150 },
        { date: "3d", logs: 170 },
        { date: "2d", logs: 180 },
        { date: "1d", logs: 220 },
        { date: "today", logs: 342 },
    ]

    return (
        <div >
            <div>
                <BreadcrumbContainer>
                    <Breadcrumb active text="Dashboard" />
                </BreadcrumbContainer>
                <p className="text-[0.7rem] sm:text-[1rem] font-medium text-[#B3B3B3] m-0">Welcome back, John</p>
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <DashboardCard>
                    <div className="text-[#B3B3B3] flex justify-between">
                        <p>Total Buildings</p>
                        {eye}
                    </div>
                    <p className="mt-[1.438rem] md:text-[4.313rem] font-bold text-[#4B4B4B] text-[3.313rem]">32</p>
                </DashboardCard>

                <DashboardCard>
                    <div className="text-[#B3B3B3] flex justify-between">
                        <p>Total Companies</p>
                        {eye}
                    </div>
                    <p className="mt-[1.438rem] md:text-[4.313rem] font-bold text-[#4B4B4B] text-[3.313rem]">48</p>
                </DashboardCard>

                <div className="lg:col-span-2 xl:col-span-1">
                    <DashboardCard>
                        <div className="text-[#B3B3B3] flex justify-between">
                            <p>Total Access Cards</p>
                            {eye}
                        </div>
                        <p className="mt-[1.438rem] md:text-[4.313rem] font-bold text-[#4B4B4B] text-[3.313rem]">487</p>
                        <p className="text-[#D7373F] m-0"><span>8</span> Inactive</p>
                    </DashboardCard>
                </div>
            </div>

            <div>
                <p className="text-[1.5rem] mt-6 font-semibold text-[#4B4B4B] mb-4">Recent Log Activity</p>
                <div className="flex">
                    <DashboardCard maxWidth>
                        <div className="text-[#B3B3B3] flex justify-between">
                            <p>Today</p>
                        </div>
                        <p className="font-bold text-[#4B4B4B] text-[1.5rem]">342</p>
                        <div className="max-w-[40rem] h-[250px] text-[0.8rem] md:text-inherit md:h-[300px] mt-[0.625rem]">
                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                <BarChart data={accessActivity}>
                                    <Tooltip />
                                    <XAxis dataKey="date" />
                                    <Bar dataKey="logs" fill="#1472e6" label={{ position: 'top' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </div>
    )
}

export default DashboardScreen