import React, { useEffect, useState } from 'react';
import { XInput, XButton } from '@ximdex/xui-react/material';
import {useNavigate } from "react-router-dom";
import User from '../models/User';
import userManagementApi from '../services/apiServices';
import LoadingSpinner from '../components/LoadingSpinner';
import { StyledSectionBorder } from '../styles/SectionStyles';
import { StyledForm, StyledDivSVG, StyledSVG } from '../styles/FormStyles';
import { StyledFlexFullCenter } from '../App';
import ErrorsModal from '../components/ErrorsModal';
import { StyledP } from '../styles/ErrorMessagesStyles';


function Register() { 
    const [error, setError] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [openModal,setOpenModal] = useState(false);
    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState({
        name: "",
        surname: "",
        birthdate: "",
        email: "",
        password:"",
        password2: ""
    })
    const {name, surname, birthdate, email, password, password2} = user;
    
    useEffect(() => {
        if(password !== password2){
            setError('Passwords dont match');
        } else {
            setError('');
        }
    },[password2, password])

    const navigate = useNavigate();

    const onInputChange = (e) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
        });
    }

    function handleSubmit(event){
        event.preventDefault();
        register();
    }

    const register = async() => {
        setIsLoading(true);
        const userDTO = {
            name: name,
            surname: surname,
            birth_date: birthdate,
            email: email,
            password: password,
            password_confirmation: password2,
        };
            
        let user = new User(userDTO);
        const body = user.toDTO();
        
        
        await userManagementApi.post('register', body)
        .then(function(response) {
            console.log(response)
            if(response.data.success === true){
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // 3000 milisegundos (3 segundos)

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
                    password2: '',
                });
                setOpenModal(true);
            }
        });
    }
    
    useEffect(() => {
        console.log(response);
    },[response])

    return (
        <StyledFlexFullCenter height={"100vh"}>
            <StyledSectionBorder>
                    <StyledP>Enter your information:</StyledP>
                    <StyledForm onSubmit={handleSubmit}>
                        <XInput id='name' type='text' label='Name' required={true} size='small' fullWidth value={name} onChange={(e) => onInputChange(e)} />
                        <XInput id='surname' type='text' label='Surname' required size='small' fullWidth value={surname} onChange={(e) => onInputChange(e)} />
                        <XInput id='birthdate' type='date' label='Birth Date' required size='small' fullWidth value={birthdate} onChange={(e) => onInputChange(e)} />
                        <XInput id='email' type='text' label='Email' required size='small' fullWidth value={email} onChange={(e) => onInputChange(e)} />
                        <XInput id='password' type='password' label='Password' required size='small' fullWidth value={password} onChange={(e) => onInputChange(e)} />
                        <XInput id='password2' type='password' label='Repeat Password' required size='small' fullWidth value={password2} onChange={(e) => onInputChange(e)} />
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
                            : <XButton type="submit" size='small'>Register</XButton>}
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