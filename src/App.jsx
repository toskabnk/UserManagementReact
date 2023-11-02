import './App.css'
import {Routes , Route } from "react-router-dom" 
import Home from './pages/Home'
import Users from './pages/Users'
import Register from './pages/Register'
import LoginPage from './pages/Login'
import Logout from './pages/Logout'
import { Navbar } from './pages/Header'

function App() {
  return (
    <>
      <Navbar/>
      <Routes> 
          <Route path="*" element={<Home/> } /> 
          <Route path="/users" element={<Users/> } /> 
          <Route path="/register" element={<Register/> } />
          <Route path="/login" element={<LoginPage/> } />
          <Route path="/logout" element={<Logout/> } />
      </Routes> 
  </>
  )
}

export default App
