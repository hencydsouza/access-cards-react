// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SidePanelElement = (props: { text: string, svg: any, active?: boolean }) => {
    const { text, svg, active } = props
    return (
        <div className={"h-[3rem] lg:h-[4rem] flex text-[rgb(182,_212,_247)] cursor-pointer hover:text-white" + (active ? " active-element" : "")}>
            <div className={"flex no-underline gap-3 items-center" + (active ? " text-white" : "")}>
                {svg}
                <p className="sm:block hidden w-max">
                    {text}
                </p>
            </div>
        </div>
    )
}

export default SidePanelElement