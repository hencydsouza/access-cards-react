import { Tooltip } from "react-bootstrap"
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"
import { eye } from "../assets/svg"
import DashboardCard from "../components/DashboardCard"
import BreadcrumbContainer from "../components/BreadcrumbContainer"
import Breadcrumb from "../components/Breadcrumb"
import { useEffect, useState } from "react"
import { useAuth } from "../hooks/AuthProvider"
import { LinkContainer } from "react-router-bootstrap"
import { useFetchDashboard } from "../hooks/useFetchQueries"
import { IDashboard } from "../types/dashboard.types"
import { getResource } from "../helpers/checkResource"

const DashboardScreen = () => {
    const auth = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    const [dashData, setDashData] = useState<IDashboard>({
        buildings: 0,
        companies: 0,
        access_card: {
            total_count: 0,
            inactive_count: 0
        },
        access_logs: [
            {
                _id: "today",
                count: 0
            }
        ]
    })

    const { data, status } = useFetchDashboard()

    useEffect(() => {
        if (status === "success") {
            data.access_logs = data.access_logs.reverse()
            const today = new Date();
            data.access_logs = data.access_logs.map((log: { _id: string, count: number }) => {
                const logDate = new Date(log._id);
                const diffDays = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays === 0) {
                    log._id = "Today";
                } else if (diffDays === 1) {
                    log._id = "1d";
                } else {
                    log._id = `${diffDays}d`;
                }
                return log;
            });

            setDashData(data)
            setIsLoading(false)
        }
    }, [status, data])



    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await useApiClient._getWithToken('/dashboard', auth.accessToken)
    //             response.data.access_logs = response.data.access_logs.reverse()

    //             const today = new Date();
    //             response.data.access_logs = response.data.access_logs.map((log: { _id: string, count: number }) => {
    //                 const logDate = new Date(log._id);
    //                 const diffDays = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    //                 if (diffDays === 0) {
    //                     log._id = "Today";
    //                 } else if (diffDays === 1) {
    //                     log._id = "1d";
    //                 } else {
    //                     log._id = `${diffDays}d`;
    //                 }
    //                 return log;
    //             });

    //             setDashData(response.data)
    //             setIsLoading(false)
    //         } catch (err) {
    //             console.log(err)
    //         }
    //     }

    //     fetchData()
    // }, [auth])

    return (
        !isLoading ? (<div >
            <div>
                <BreadcrumbContainer>
                    <Breadcrumb active text="Dashboard" />
                </BreadcrumbContainer>
                <p className="text-[0.7rem] sm:text-[1rem] font-medium text-[#B3B3B3] m-0">Welcome back, {auth.user?.name}</p>
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className={['product'].some(item => item === getResource()) ? "" : "hidden"}>
                    <DashboardCard>
                        <div className="text-[#B3B3B3] flex justify-between">
                            <p className="text-[0.8rem] sm:text-[1rem]">Total Buildings</p>
                            <LinkContainer to="/dashboard/buildings" className="cursor-pointer h-[18px] sm:h-[24px]">
                                {eye}
                            </LinkContainer>
                        </div>
                        <p className="mt-[1rem] md:text-[4.313rem] font-bold text-[#4B4B4B] text-[2.5rem]">{dashData.buildings}</p>
                    </DashboardCard>
                </div>

                <div className={['product', 'building'].some(item => item === getResource()) ? "" : "hidden"}>
                    <DashboardCard>
                        <div className="text-[#B3B3B3] flex justify-between">
                            <p className="text-[0.8rem] sm:text-[1rem]">Total Companies</p>
                            <LinkContainer to="/dashboard/companies" className="cursor-pointer h-[18px] sm:h-[24px]">
                                {eye}
                            </LinkContainer>
                        </div>
                        <p className="mt-[1rem] md:text-[4.313rem] font-bold text-[#4B4B4B] text-[2.5rem]">{dashData.companies}</p>
                    </DashboardCard>
                </div>

                <div className="lg:col-span-2 xl:col-span-1">
                    <DashboardCard>
                        <div className="text-[#B3B3B3] flex justify-between">
                            <p className="text-[0.8rem] sm:text-[1rem]">Total Access Cards</p>
                            <LinkContainer to="/dashboard/access-cards" className="cursor-pointer h-[18px] sm:h-[24px]">
                                {eye}
                            </LinkContainer>
                        </div>
                        <p className="mt-[1rem] md:text-[4.313rem] font-bold text-[#4B4B4B] text-[2.5rem]">{dashData.access_card.total_count}</p>
                        {(dashData.access_card.inactive_count ? <p className="text-[#D7373F] m-0"><span>{dashData.access_card.inactive_count}</span> Inactive</p> : "")}
                    </DashboardCard>
                </div>
            </div>

            <div>
                <p className="sm:text-[1.5rem] mt-6 font-semibold text-[#4B4B4B] mb-4">Recent Log Activity</p>
                <div className="flex">
                    <DashboardCard maxWidth>
                        <div className="text-[#B3B3B3] flex justify-between">
                            <p className="text-[0.8rem] sm:text-[1rem]">Today</p>
                        </div>
                        <p className="font-bold text-[#4B4B4B] text-[1.5rem]">{dashData.access_logs[dashData.access_logs.length - 1]._id === "Today" ? dashData.access_logs[dashData.access_logs.length - 1].count : 0}</p>
                        <div className="max-w-[40rem] h-[200px] text-[0.8rem] md:text-inherit md:h-[300px] mt-[0.625rem]">
                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                <BarChart data={dashData.access_logs}>
                                    <Tooltip />
                                    <XAxis dataKey="_id" />
                                    <Bar dataKey="count" fill="#1472e6" label={{ position: 'top' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </div>) : (<div className="text-center font-semibold">Loading...</div>)
    )
}

export default DashboardScreen