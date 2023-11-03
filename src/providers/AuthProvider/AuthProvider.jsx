import React, { createContext, useContext, useState, useEffect } from 'react';
import userManagementApi from '../../services/apiServices';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from "../../redux/userSlice"

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.access_token);
  const roles = useSelector((state) => state.user.roles);

  useEffect(() => {
    if(token) {
      setIsAuthenticated(true);
      setIsAdmin(roles.some(role => role.name === "Admin"));
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  })

  //Actualiza el estado de autenticacion
  const login = () => {
    setIsAuthenticated(true);
  };

  //Revoca el token, lo borra del localStorage y navega a la pagina de logout
  const logout = async () => {
    await userManagementApi.post('logout','', {bearerToken: token})
    .then((response => {
      dispatch(deleteUser());
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate('logout');
    }))
    .catch((error) => {
      console.log(error)
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, logoutError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;