const getResource = () => {
    const resource = localStorage.getItem("resource")
    if (resource) {
        return resource
    } else {
        console.log("No resource found")
    }
}

const checkResource = (resource: string[]) => {
    if (resource.some((item) => item === getResource()))
        return true
    else
        return false
}

export {
    getResource,
    checkResource
}