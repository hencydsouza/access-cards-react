import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router";
import useApiClient from "./ApiClient";
import { toast } from "react-toastify";

interface IAuth {
    user: { name: string, email: string } | null,
    loginAction: (data: { email: string, password: string, resource: string }) => void,
    logoutAction: () => void,
    refresh: (token: string) => void,
    accessToken: string,
    refreshToken: string
}

const AuthContext = createContext<IAuth>({
    user: null,
    loginAction: () => { },
    logoutAction: () => { },
    refresh: () => { },
    accessToken: "",
    refreshToken: ""
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthProvider = (props: { children: any }) => {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState("")
    const [refreshToken, setRefreshToken] = useState<string>(localStorage.getItem("refreshToken") || "")
    const navigate = useNavigate()

    const refresh = async (token: string) => {
        try {
            const response = await useApiClient._post('/auth/refresh-tokens', { refreshToken: token })
            console.log(response.data)
            setUser(response.data.employee)
            setAccessToken(response.data.tokens.access.token)
            setRefreshToken(response.data.tokens.refresh.token)
            localStorage.setItem("refreshToken", response.data.tokens.refresh.token)
        } catch (error) {
            console.log(error)
            setUser(null)
            setAccessToken("")
            setRefreshToken("")
            localStorage.removeItem("refreshToken")
        }
    }

    const loginAction = async (data: { email: string, password: string, resource: string }) => {
        try {
            const response = await useApiClient._post('/auth/login', data)

            if (response.data) {
                console.log(response.data)
                setUser(response.data.employee)
                setAccessToken(response.data.tokens.access.token)
                setRefreshToken(response.data.tokens.refresh.token)
                localStorage.setItem("refreshToken", response.data.tokens.refresh.token)
                navigate('/dashboard')
                toast.success("Login successful", { theme: "colored", position: "bottom-right" })
                return
            }
            throw new Error("Something went wrong")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response.data.message, { theme: "colored", position: "bottom-right" })
            // console.log(err)
        }
    }

    const logoutAction = async () => {
        setUser(null)
        setAccessToken("")
        setRefreshToken("")
        localStorage.removeItem("refreshToken")
        await useApiClient._post('/auth/logout', {
            refreshToken
        })
        toast.success("Logout successful", { theme: "colored", position: "bottom-right" })
        navigate("/login")
    }

    return (
        <AuthContext.Provider value={{ user, loginAction, logoutAction, accessToken, refreshToken, refresh }}>
            {props.children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};