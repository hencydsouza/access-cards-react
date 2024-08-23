import { Outlet } from "react-router-dom"
import './app.scss'

function App() {
  return (
    <main className="bg-[#f7faff]">
      <Outlet />
    </main>
  )
}

export default App
