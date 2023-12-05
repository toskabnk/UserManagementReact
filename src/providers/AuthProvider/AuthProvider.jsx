import React, { createContext, useContext, useState, useEffect } from 'react';
import userManagementApi from '../../services/apiServices';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from "../../redux/userSlice"
import Swal from 'sweetalert2';

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.access_token);
  const roles = useSelector((state) => state.user.roles);

  useEffect(() => {
    if(token) {
      setIsAuthenticated(true);
      setIsSuperAdmin(roles.some(role => role.name === "SuperAdmin"));
      setIsAdmin(roles.some(role => role.name === "Admin"));
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    }
  })

  //Actualiza el estado de autenticacion
  const login = () => {
    setIsAuthenticated(true);
  };

  async function logoutUser() {
    await userManagementApi.post('logout','', {bearerToken: token})
      .then((response => {
        dispatch(deleteUser());
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        navigate('/login?logout=true');
      }))
      .catch((error) => {
        console.log(error);
      });
  }

  async function forceLogout() {
    dispatch(deleteUser());
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    navigate('/login?error=true');
  }

  //Revoca el token, lo borra del localStorage y navega a la pagina de logout
  const logout = async () => {
    Swal.fire({
      title: '¿Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#43a1a2',
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser();
      }
    })
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, isSuperAdmin, logoutError, login, logout, forceLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;