export interface IBuildings {
    id: string
    name: string,
    _id: string,
    address: string,
    company: {
        name: string,
        _id: string
    }[]
}

export interface IBuildingInput {
    name: string,
    address: string,
}

export interface IBuildingUpdate {
    name: string,
    address: string,
}