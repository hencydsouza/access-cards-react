export interface ICompanyOwnedBuildingsUpdate {
    ownedBuildings: { buildingId: string }[]
}

export interface ICompany {
    name: string,
    id: string,
    buildings: {
        buildingId: string,
        buildingName: string,
    },
    ownedBuildings: {
        buildingId: string,
        buildingName: string,
        _id: string
    }[]
}

export interface ICompanyCreate {
    name: string,
    buildingId: string,
    ownedBuildings?: {
        buildingId: string
    }[]
}