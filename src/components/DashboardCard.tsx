// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DashboardCard = (props: { children: any, maxWidth?: boolean }) => {
    const { children, maxWidth } = props
    return (
        <div className={"bg-white rounded-[1.5rem] border border-[#e8f1fc]" + (maxWidth ? " w-100" : " w-auto")}>
            <div className="p-8">
                {children}
            </div>
        </div>
    )
}

export default DashboardCard