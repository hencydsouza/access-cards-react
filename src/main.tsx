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
import CompaniesScreen from './screens/companies/CompaniesScreen.tsx'
import CompaniesDetailsScreen from './screens/companies/CompaniesDetailsScreen.tsx'
import CompaniesEditScreen from './screens/companies/CompaniesEditScreen.tsx'
import CompaniesAddScreen from './screens/companies/CompaniesAddScreen.tsx'
import AccessLevelsScreen from './screens/accessLevels/AccessLevelsScreen.tsx'
import AccessLevelsDetailsScreen from './screens/accessLevels/AccessLevelsDetailsScreen.tsx'
import AccessLevelEditScreen from './screens/accessLevels/AccessLevelEditScreen.tsx'
import AccessLevelAddScreen from './screens/accessLevels/AccessLevelAddScreen.tsx'
import EmployeesScreen from './screens/employees/EmployeesScreen.tsx'
import EmployeeDetailsScreen from './screens/employees/EmployeeDetailsScreen.tsx'
import EmployeeEditScreen from './screens/employees/EmployeeEditScreen.tsx'
import EmployeeAddScreen from './screens/employees/EmployeeAddScreen.tsx'
import AccessLogsScreen from './screens/accessLogs/AccessLogsScreen.tsx'
import AccessCardsScreen from './screens/accessCards/AccessCardsScreen.tsx'
import AccessCardsDetailsScreen from './screens/accessCards/AccessCardsDetailsScreen.tsx'
import AccessCardsEditScreen from './screens/accessCards/AccessCardsEditScreen.tsx'
import AccessCardsAddScreen from './screens/accessCards/AccessCardsAddScreen.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<DashLayout />}>
          <Route path='/dashboard' index={true} element={<DashboardScreen />} />
          {/* building routes */}
          <Route path='/dashboard/buildings' element={<BuildingsScreen resource={['product']} />} />
          <Route path='/dashboard/buildings/:id' element={<BuildingsDetailsScreen resource={['product', 'building']} />} />
          <Route path='/dashboard/buildings/edit/:id' element={<BuildingsEditScreen resource={['product']} />} />
          <Route path='/dashboard/buildings/add' element={<BuildingsAddScreen resource={['product']} />} />
          {/* company routes */}
          <Route path='/dashboard/companies' element={<CompaniesScreen resource={['product', 'building']} />} />
          <Route path='/dashboard/companies/:id' element={<CompaniesDetailsScreen resource={['product', 'building', 'company']} />} />
          <Route path='/dashboard/companies/edit/:id' element={<CompaniesEditScreen resource={['product', 'company']} />} />
          <Route path='/dashboard/companies/add' element={<CompaniesAddScreen resource={['product']} />} />
          {/* access levels */}
          <Route path='/dashboard/access-levels' element={<AccessLevelsScreen />} />
          <Route path='/dashboard/access-levels/:id' element={<AccessLevelsDetailsScreen />} />
          <Route path='/dashboard/access-levels/edit/:id' element={<AccessLevelEditScreen />} />
          <Route path='/dashboard/access-levels/add' element={<AccessLevelAddScreen />} />
          {/* employees routes */}
          <Route path='/dashboard/employees' element={<EmployeesScreen />} />
          <Route path='/dashboard/employees/:id' element={<EmployeeDetailsScreen />} />
          <Route path='/dashboard/employees/edit/:id' element={<EmployeeEditScreen />} />
          <Route path='/dashboard/employees/add' element={<EmployeeAddScreen />} />
          {/* Access Logs */}
          <Route path='/dashboard/access-logs' element={<AccessLogsScreen />} />
          {/* Access Card */}
          <Route path='/dashboard/access-cards' element={<AccessCardsScreen />} />
          <Route path='/dashboard/access-cards/:id' element={<AccessCardsDetailsScreen />} />
          <Route path='/dashboard/access-cards/edit/:id' element={<AccessCardsEditScreen />} />
          <Route path='/dashboard/access-cards/add' element={<AccessCardsAddScreen />} />
        </Route>
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
)