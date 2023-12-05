import React, { useEffect, useState } from 'react';
import { XInput, XButton } from '@ximdex/xui-react/material';
import {useNavigate, useSearchParams } from "react-router-dom";
import userManagementApi from '../services/apiServices';
import LoadingSpinner from '../components/LoadingSpinner';
import { StyledSectionBorder } from '../styles/SectionStyles';
import { StyledForm, StyledDivSVG, StyledSVG } from '../styles/FormStyles';
import { StyledFlexFullCenter } from '../App';
import ErrorsModal from '../components/ErrorsModal';
import { StyledP } from '../styles/ErrorMessagesStyles';
import { Alert } from '@mui/material';


function Register() { 
    let [searchParams] = useSearchParams();
    const client = searchParams.get("client");
    
    const [error, setError] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [openModal,setOpenModal] = useState(false);
    const [errors, setErrors] = useState(null);
    const [clientName, setClientName] = useState(null);
    const [user, setUser] = useState({
        name: "",
        surname: "",
        birth_date: "",
        email: "",
        password:"",
        password_confirmation: "",
        idClient: null,

    })
    
    const navigate = useNavigate();

    const {name, surname, birth_date, email, password, password_confirmation} = user;
    
    //Comprueba que las contraseñas coinciden
    useEffect(() => {
        if(password !== password_confirmation){
            setError('Passwords dont match');
        } else {
            setError('');
        }
    },[password_confirmation, password])

    //Actualiza el objeto user con los datos del formulario
    const onInputChange = (e) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
        });
    }

    //Envia el formulario
    function handleSubmit(event){
        event.preventDefault();
        register();
    }

    //Envia los datos al servidor
    const register = async() => {
        setIsLoading(true);

        let copyUser = user;
        
        //Elimina los campos vacios del objeto user
        Object.keys(copyUser).forEach(key => copyUser[key] == null && delete copyUser[key]);

        console.log(copyUser)

        await userManagementApi.post('register', copyUser)
        .then(function(response) {
            if(response.data.success === true){
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 800);
            }
        })
        .catch(function (error) {
            console.log(error)
            setIsSuccess(false)
            setIsLoading(false)
            const responseData = error.response.data;
            if (responseData.data && responseData.data.errors) {
                const validationErrors = responseData.data.errors;
                setErrors(validationErrors);
                setUser({
                    ...user,
                    password: '',
                    password_confirmation: '',
                });
                setOpenModal(true);
            }
        });
    }

    //Obtiene el dato del cliente
    async function getClient () {
        if(client === null) return;
        await userManagementApi.get(`register/${client}`)
        .then(function(response) {
            console.log(response)
            if(response.data.success === true){
                setUser({
                    ...user,
                    idClient: client,
                });
                setClientName(response.data.data.client_name);
            }
        })
        //Si el cliente no existe, no hace nada
    }
    
    //Obtiene el dato del cliente al cargar la pagina
    useEffect(() => {
        getClient();
    },[client])

    return (
        <StyledFlexFullCenter height={"100vh"}>
            <StyledSectionBorder>
                    <StyledP>Enter your information:</StyledP>
                    <StyledForm onSubmit={handleSubmit}>
                        {clientName ? <Alert icon={false} severity="info">Register for client: {clientName}</Alert> : null}
                        <XInput id='name' type='text' label='Name' required={true} size='small' fullWidth value={name} onChange={(e) => onInputChange(e)} />
                        <XInput id='surname' type='text' label='Surname' required size='small' fullWidth value={surname} onChange={(e) => onInputChange(e)} />
                        <XInput id='birth_date' type='date' label='Birth Date' required size='small' fullWidth value={birth_date} onChange={(e) => onInputChange(e)} />
                        <XInput id='email' type='text' label='Email' required size='small' fullWidth value={email} onChange={(e) => onInputChange(e)} />
                        <XInput id='password' type='password' label='Password' required size='small' fullWidth value={password} onChange={(e) => onInputChange(e)} />
                        <XInput id='password_confirmation' type='password' label='Repeat Password' required size='small' fullWidth value={password_confirmation} onChange={(e) => onInputChange(e)} />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {isLoading ? 
                            (isSuccess ? 
                                <StyledDivSVG>
                                    <StyledSVG
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <path d="M9 16.17l-4.24-4.24-1.41 1.41 5.66 5.66 12-12-1.41-1.41z" />
                                    </StyledSVG>
                                </StyledDivSVG>
                                : <LoadingSpinner />) 
                            : <XButton onClick={register} size='small'>Register</XButton>}
                    </StyledForm>
            </StyledSectionBorder>
            <ErrorsModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            errors={errors}
            />
        </StyledFlexFullCenter> 
    ); 
} 
export default Register; 