import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EmployeeRecordPage from './pages/EmployeeRecordPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/profile' element={<ProfilePage />}/>
          <Route path='/hr/employees' element={<EmployeeRecordPage />}/>
        </Routes>
      </Router>
      <Toaster position='top-center'/>
    </>
  )
}

export default App
