export interface IAccessLevel {
    name: string,
    type: string,
    id: string,
    description: string,
    permissions: {
        resource: string,
        action: string
    }[] | []
}

export interface IAccessLevelCreate {
    name: string,
    type: string,
    description: string,
    permissions: {
        resource: string,
        action: string
    }[] | []
}