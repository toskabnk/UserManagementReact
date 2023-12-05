import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import LoadingButton from '@mui/lab/LoadingButton';
import { StyledForm } from '../styles/FormStyles';
import { StyledPageContainer, StyledPageMarginContainer } from '../styles/Containers';
import { XCard, XInput, XPopUp } from '@ximdex/xui-react/material';
import { useSelector } from 'react-redux';
import userManagementApi from '../services/apiServices';
import ErrorsModal from '../components/ErrorsModal';
import { Stack } from '@mui/system';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PasswordChange = () => {
    const token = useSelector((state) => state.user.access_token);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [openModal,setOpenModal] = useState(false);
    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        newPassword_confirmation: ''
    });
    
    const navigate = useNavigate();
    
    const tooltip = <FontAwesomeIcon icon={faPenToSquare} size='1x' title={'Create Profile'} />;

    //Cambia la contraseña
    const changePassword = async() => {
        setLoading(true);
        
        let passwordData = password;

        await userManagementApi.put('/password', passwordData, { bearerToken: token })
        .then((response) => {
            XPopUp({
                message: `Password changed!`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
        })
        .catch((error) => {
            const responseData = error.response.data;
            if (responseData.data && responseData.data.errors) {
                const validationErrors = responseData.data.errors;
                setErrors(validationErrors);
                setPassword({
                    oldPassword: '',
                    newPassword: '',
                    newPassword_confirmation: '',
                });
                setOpenModal(true);
            } else {
                if (responseData.data.message) {
                    let error = [responseData.data.message]

                    let errors = {
                        errors: error
                    };

                    console.log(errors);

                    setErrors(errors);
                    setPassword({
                        oldPassword: '',
                        newPassword: '',
                        newPassword_confirmation: '',
                    });
                    setOpenModal(true);
                }
            }
        })
        .finally(() => {
            setLoading(false);
        })
    }

    //Envia los datos del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        changePassword();
    }

    //Actualiza el estado de los inputs
    const onInputChange = (e) => {
        setPassword({
            ...password,
            [e.target.id]: e.target.value
        });
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            <StyledPageContainer>
                <h2>Change password</h2>
                <XCard title='Password' tooltip={tooltip} style={{height: '200px'}}>
                    <StyledPageMarginContainer>
                        <XInput id='oldPassword' type="password" label="Current Password" value={password.name} onChange={(e) => onInputChange(e)} fullWidth required/>
                        <Stack sx={{marginTop: 2}}spacing={2} direction="row">
                            <XInput id='newPassword' type="password" label="New Password" value={password.name} onChange={(e) => onInputChange(e)} fullWidth required/>
                            <XInput id='newPassword_confirmed' type="password" label="Confirm new password" value={password.name} onChange={(e) => onInputChange(e)} fullWidth required/>
                        </Stack>
                        </StyledPageMarginContainer>
                </XCard>
                    <LoadingButton loading={loading} variant="contained" type="submit">
                        <span>Edit profile</span>
                    </LoadingButton>
                    <Button style={{float: 'right'}} variant="contained" onClick={() => {navigate('/user')}}>Back</Button>
            </StyledPageContainer>
            <ErrorsModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            errors={errors}
            />
        </StyledForm>
    )
}

export default PasswordChange