import React, { createContext, useContext, useState, useEffect } from 'react';
import userManagementApi from '../services/apiServices';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState(null);
  const [userID, setUserID] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [logoutError, setLogoutError] = useState(null);

  const navigate = useNavigate();

  //Comprueba si hay un token
  useEffect(() => {
    let token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      let name = localStorage.getItem('name');
      let id = localStorage.getItem('id');
      setName(name);
      setUserID(id);
      setAccessToken(token)

    } else {
      setIsAuthenticated(false);
      setName(null);
      setUserID(null);
      setAccessToken(null)
    }
    console.log(`AccessToken actualizado`);
  });

  //Actualiza el estado de autenticacion
  const login = () => {
    setIsAuthenticated(true);
    let token = localStorage.getItem('access_token');
  };

  //Revoca el token, lo borra del localStorage y navega a la pagina de logout
  const logout = async () => {
    let token = localStorage.getItem('access_token');
    await userManagementApi.post('logout','', {bearerToken: token})
    .then((response => {
        setIsAuthenticated(false);
        userManagementApi.post('logout',)
        localStorage.removeItem('access_token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        navigate('logout');
    }))
    .catch((error) => {
        console.log(error)
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, name, userID, logoutError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};