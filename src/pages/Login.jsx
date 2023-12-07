import React, { useEffect, useState } from 'react';
import { XInput, XButton, XModal } from '@ximdex/xui-react/material'
import styled from 'styled-components';
import { StyledSectionBorder } from '../styles/SectionStyles';
import { StyledForm, StyledDivSVG, StyledSVG } from '../styles/FormStyles';
import userManagementApi from '../services/apiServices';
import { DivErrorMessages, ListErrorMessages, ElementErrorMessages} from '../styles/ErrorMessagesStyles';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../providers/AuthProvider/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice"
import { Alert, IconButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

const StyledP = styled.p`
    margin-top: 10px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
`;

const StyledModal = styled(XModal)`
    background-color: white;
    border: 2px solid #214f61;
    border-radius: 16px;
    height: 300px;
    width: 300px;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
`;

function LoginPage() { 
    const { isAuthenticated, login } = useAuth();

    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [openModal,setOpenModal] = useState(false);
    const [errors, setErrors] = useState(null);
    const [errore, setError] = useState(null);
    const [openLogout, setOpenLogout] = useState(false); //Alert de logout
    const [openError, setOpenError] = useState(false); //Alert de forceLogout

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Comprueba si accedes a la pagina de login cuando estas autenticado
    useEffect(() => {
        if(isAuthenticated && !isSuccess){
            navigate('/')
        }
    }, [isAuthenticated])
    
    //Datos a enviar para la autenticacion
    const [loginData, setLoginData] = useState({
        email: "",
        password:""
    })

    const {email, password} = loginData;

    //Funcion que actualiza los datos segun el formulario
    const onInputChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.id]: e.target.value
        });
    }

    //Ejecuta la peticion de autenticacion
    async function loginFunction() {
        //Mostramos el spinner
        setIsLoading(true);

        //Peticion a la API para la autenticacion
        await userManagementApi.post('login', loginData)
        .then((response) => {
            //Si ha sido correcta
            if(response.data.success === true){
                //Mostramos el tick de confirmacion
                setIsSuccess(true);
                //Cambiamos el estado del AuthProvider a autenticado
                login();

                //Guardamos algunas variables en el localStorage
                let token = response.data.data.token;
                let name;
                if(response.data.data.user.client === null){
                    name = response.data.data.user.member.name;
                } else {
                    name = response.data.data.user.client.name;
                }
                let id = response.data.data.user.id;
                let roles = response.data.data.roles;

                let state = {
                    name: name,
                    access_token: token,
                    id: id,
                    roles: roles
                };

                dispatch(addUser(state));
                //Nos redirige a la pagina principal
                navigate('/');
            }
            
        })
        .catch((error) => {
            //Inicializamos states
            setErrors('');
            setError('')

            //Volvemos a mostrar el boton de login
            setIsSuccess(false);
            setIsLoading(false);
            //Guardamos los datos de la respuesta
            const responseData = error.response.data;

            //Si errores no esta vacio
            if (responseData.data.errors.length !== 0) {
                //Guardamos los errores
                const validationErrors = responseData.data.errors;
                setErrors(validationErrors);
            //Si los errores estan vacios
            } else {
                //Mostramos el mensaje
                setError(responseData.data.message);
            }

            //Borramos la contraseña del formulario
            setLoginData({
                ...loginData,
                password: '',
            });

            //Abrimos el modal
            setOpenModal(true);
        })
    }

    //Muestra el Alert de logout o error si se pasa por la url
    useEffect(() => {
        if(searchParams.get('logout')){
            setOpenLogout(true);
        }

        if(searchParams.get('error')){
            setOpenError(true);
        }
    }, [searchParams])

    return (
        <>
            <StyledSectionBorder>
                <StyledP>Login</StyledP>
                <StyledForm>
                    {/*Muestra un Alert si logout o error ha sido pasado por en url*/}
                    {searchParams.get('logout') && 
                        <Collapse in={openLogout}>
                            <Alert
                                variant="outlined" 
                                action={
                                    <IconButton
                                      aria-label="close"
                                      color="inherit"
                                      size="small"
                                      onClick={() => {
                                        setOpenLogout(false);
                                    }}>
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                severity="info">
                                    Logged out!
                            </Alert>
                        </Collapse>}
                    {searchParams.get('error') && 
                        <Collapse in={openError}>
                            <Alert 
                                variant="outlined"
                                action={
                                    <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpenError(false);
                                    }}>
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                severity="error">
                                    Session expired
                            </Alert>
                        </Collapse>}
                    <XInput id='email' type='text' label='Email' required={true} size='small' fullWidth value={email} onChange={(e) => onInputChange(e)} />
                    <XInput id='password' type='password' label='Password' required={true} size='small' fullWidth value={password} onChange={(e) => onInputChange(e)} />
                    {/*Si esta cargando  y no hay exito muestra el spinner*/
                    isLoading ? 
                            (isSuccess ? 
                                /*Si esta cargando  y  hay exito muestra el tick*/
                                <StyledDivSVG>
                                    <StyledSVG
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <path d="M9 16.17l-4.24-4.24-1.41 1.41 5.66 5.66 12-12-1.41-1.41z" />
                                    </StyledSVG>
                                </StyledDivSVG>
                                /* Spinner */
                                : <LoadingSpinner />) 
                            /* Si no esta cargando, muestra el boton */
                            : <XButton onClick={loginFunction} size='small'>Login</XButton>}         
                </StyledForm>
            </StyledSectionBorder>
            <StyledModal setOpenModal={setOpenModal} openModal={openModal}>
            {/* Si hay errores los muestra en el modal*/
            (errors) && (
                <DivErrorMessages>
                    <StyledP>Errors: </StyledP>
                    <ListErrorMessages>
                        {Object.keys(errors).map(key => (
                            <ElementErrorMessages key={key}>{errors[key][0]}</ElementErrorMessages>
                        ))}
                    </ListErrorMessages>
                </DivErrorMessages>
            )}
            {/* Si hay un error lo muestra en el modal*/
            (errore) && (
                <DivErrorMessages>
                    <StyledP>Error: </StyledP>
                    <ListErrorMessages>
                    <ElementErrorMessages key={0}>{errore}</ElementErrorMessages>
                    </ListErrorMessages>
                </DivErrorMessages>
            )}
            </StyledModal>
        </> 
    ); 
} 
export default LoginPage; 