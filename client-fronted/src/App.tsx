import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage'
import DashboardPage from './pages/Employee/DashboardPage'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
