// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BreadcrumbContainer = (props: { children: any }) => {
    const { children } = props
    return (
        <nav aria-label="breadcrumb" >
            <ol className="text-[1.5rem] md:text-[2.25rem] breadcrumb">
                {children}
            </ol>
        </nav>
    )
}

export default BreadcrumbContainer