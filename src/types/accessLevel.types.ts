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