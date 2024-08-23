import { Navigate, Outlet } from "react-router"
import { useAuth } from "../hooks/AuthProvider"

const PrivateRoute = () => {
    const user = useAuth()
    if (!user.user && !localStorage.getItem("refreshToken"))
        return <Navigate to="/login" />
    else if (!user.user && localStorage.getItem("refreshToken")) {
        user.refresh(String(localStorage.getItem("refreshToken")))
    }
    
    return (
        <Outlet />
    )
}

export default PrivateRoute