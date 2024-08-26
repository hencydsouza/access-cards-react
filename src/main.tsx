import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.tsx'
import LoginScreen from './screens/LoginScreen.tsx'
import DashboardScreen from './screens/DashboardScreen.tsx'
import BuildingsScreen from './screens/buildings/BuildingsScreen.tsx'
import BuildingsEditScreen from './screens/buildings/BuildingsEditScreen.tsx'
import BuildingsAddScreen from './screens/buildings/BuildingsAddScreen.tsx'
import DashLayout from './layouts/DashLayout.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import BuildingsDetailsScreen from './screens/buildings/BuildingsDetailsScreen.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<DashLayout />}>
          <Route path='/dashboard' index={true} element={<DashboardScreen />} />
          <Route path='/dashboard/buildings' element={<BuildingsScreen />} />
          <Route path='/dashboard/buildings/:id' element={<BuildingsDetailsScreen />} />
          <Route path='/dashboard/buildings/edit/:id' element={<BuildingsEditScreen />} />
          <Route path='/dashboard/buildings/add' element={<BuildingsAddScreen />} />

        </Route>
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)