import { Outlet } from "react-router-dom"
import './app.scss'
import AuthProvider from "./hooks/AuthProvider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <AuthProvider>
      <main className="bg-[#f7faff]">
        <Outlet />
        <ToastContainer />
      </main>
    </AuthProvider>
  )
}

export default App
