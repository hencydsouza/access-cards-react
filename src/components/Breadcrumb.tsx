import { LinkContainer } from "react-router-bootstrap"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Breadcrumb = (props: { active?: boolean, text: string, link?: string, state?: any }) => {
    const { active, text, link, state } = props
    return (
        (link ?
            <LinkContainer to={link} state={state}>
                <li className={"breadcrumb-item cursor-pointer hover:underline hover:decoration-[#1472e6]" + (active ? " active" : "")} aria-current="page">{text}</li>
            </LinkContainer>
            :
            <li className={"breadcrumb-item cursor-default" + (active ? " active" : "")} aria-current="page">{text}</li>
        )
    )
}

export default Breadcrumb