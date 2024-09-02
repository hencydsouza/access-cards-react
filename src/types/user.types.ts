export interface IUser {
    employee: {
        accessCardId: string,
        accessLevels: {
            accessLevel: string,
            _id: string
        }[],
        company: {
            buildingId: string,
            companyId: string
        },
        email: string,
        id: string,
        permissions: {
            resource: string,
            action: string,
            type: string
        }[]
    },
    tokens: {
        access: {
            token: string,
            expires: string
        },
        refresh: {
            token: string,
            expires: string
        }
    }
}