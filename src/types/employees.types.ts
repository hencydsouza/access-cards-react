export interface IEmployee {
    name: string,
    id: string,
    email: string,
    company: {
        buildingId: string,
        companyId: string
    },
    permissions: {
        resource: string,
        action: string,
        type: string
    }[],
    accessLevels: {
        accessLevel: string
    }[]
}

export interface IEmployeeCreate {
    name: string,
    email: string,
    buildingId: string,
    companyId: string
    accessLevels: {
        accessLevel: string
    }[]
}