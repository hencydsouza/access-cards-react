export interface IAccessCards {
    cardHolder: { 
        buildingId: string, 
        companyId: string, 
        employeeId: string 
    }, 
    cardNumber: string, 
    id: string, 
    is_active: boolean, 
    issued_at: string, 
    valid_until: string | null
}