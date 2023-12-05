import './App.css'
import { Navbar } from './pages/Header'
import styled from 'styled-components';
import Routes from './routes/Routes';
import { useEffect } from 'react';
import userManagementApi from './services/apiServices';
import { useAuth } from './providers/AuthProvider/AuthContext';
import { useSelector } from 'react-redux';

export const StyledFlexFullCenter = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  height: ${props => (props.height ? props.height : '100vh;')};;
  background-color: #eeeeee;
`

function App() {

  const token = useSelector((state) => state.user.access_token);
  const { forceLogout } = useAuth();

  useEffect(() => {
    async function fetchMe() {
      await userManagementApi.get('/me', { bearerToken: token })
        .catch((error) => {
          //Si el error es 401, el token ha expirado, por lo que se fuerza el logout
          if (error.response.status === 401){
            forceLogout();
          }
        })
    }
    if (token !== null) {
      fetchMe();
    }
  }, [token]);

  return (
    <StyledFlexFullCenter height='100%'>
      <Navbar/>
      <Routes/> 
    </StyledFlexFullCenter>
  )
}

export default App
