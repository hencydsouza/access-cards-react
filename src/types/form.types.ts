export interface ICompanyNames {
    name: string,
    _id: string,
    ownedBuildings: {
        buildingId: string
    }[]
}

export interface IBuildingNames {
    name: string,
    id: string
}

export interface IAccessLevelNames {
    name: string,
    id: string
}

export interface IEmployeeNames {
    name: string,
    id: string
}