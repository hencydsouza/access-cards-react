export interface IDashboard {
    buildings: number,
    companies: number,
    access_card: {
        total_count: number,
        inactive_count: number
    },
    access_logs: {
        _id: string,
        count: number
    }[]
}