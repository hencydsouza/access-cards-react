const Breadcrumb = (props: { active?: boolean, text: string }) => {
    const { active, text } = props
    return (
        <li className={"breadcrumb-item" + (active ? " active" : "")} aria-current="page">{text}</li>
    )
}

export default Breadcrumb