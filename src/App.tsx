import { Outlet } from "react-router-dom"
import './app.scss'
import AuthProvider from "./hooks/AuthProvider"

function App() {
  return (
    <AuthProvider>
      <main className="bg-[#f7faff]">
        <Outlet />
      </main>
    </AuthProvider>
  )
}

export default App
