import { LinkContainer } from "react-router-bootstrap"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SidePanelElement = (props: { text: string, svg: any, onClick?: any, link: string }) => {
    const { text, svg, onClick, link } = props
    return (
        <LinkContainer to={link}>
            <div onClick={onClick} className={"h-[3rem] lg:h-[4rem] flex text-[rgb(182,_212,_247)] cursor-pointer hover:text-white" + (window.location.pathname === link ? " active-element" : "")}>
                <div className={"flex no-underline gap-3 items-center" + (window.location.pathname ===  link ? " text-white" : "")}>
                    {svg}
                    <p className="sm:block hidden w-max">
                        {text}
                    </p>
                </div>
            </div>
        </LinkContainer>
    )
}

export default SidePanelElement