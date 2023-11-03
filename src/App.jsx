import './App.css'
import {Routes , Route } from "react-router-dom" 
import Home from './pages/Home'
import Users from './pages/Users'
import Register from './pages/Register'
import LoginPage from './pages/Login'
import Logout from './pages/Logout'
import User from './pages/User'
import Roles from './pages/Roles'
import Organizations from './pages/Organizations'
import { Navbar } from './pages/Header'
import styled from 'styled-components';

export const StyledFlexFullCenter = styled('div')`
  display: flex;
  flex-direction: column;
  jusitfy-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

`
function App() {
  return (
    <StyledFlexFullCenter>
      <Navbar/>
      <Routes> 
          <Route path="*" element={<Home/> } /> 
          <Route path="/user" element={<User/> } />
          <Route path="/users" element={<Users/> } />
          <Route path="/roles" element={<Roles/> } />
          <Route path="/organizations" element={<Organizations/> } /> 
          <Route path="/register" element={<Register/> } />
          <Route path="/login" element={<LoginPage/> } />
          <Route path="/logout" element={<Logout/> } />
      </Routes> 
  </StyledFlexFullCenter>
  )
}

export default App
