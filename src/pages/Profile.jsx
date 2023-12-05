import React, { useEffect, useState } from 'react';
import { StyledForm } from '../styles/FormStyles';
import { CenteredSpinner } from '../styles/Spinner';
import LoadingButton from '@mui/lab/LoadingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { StyledPageContainer, StyledPageMarginContainer } from '../styles/Containers';
import { XCard, XDropdown, XInput, XList, XPopUp } from '@ximdex/xui-react/material';
import userManagementApi from '../services/apiServices';
import { useSelector } from 'react-redux';
import { Button, Stack } from '@mui/material';
import { useAuth } from '../providers/AuthProvider/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() { 
    const token = useSelector((state) => state.user.access_token);
    const { isSuperAdmin } = useAuth();

    const [dataLoading, setDataLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [roleList, setRoleList] = useState([]); //Lista con los roles
    const [orgList, setOrgList] = useState([]); //Lista con las organizaciones
    const [orgsFixed, setOrgFixed] = useState([]); //Organizaciones que se muestran en el dropdown
    const [selectedOrg, setSelectedOrg] = useState(undefined); //Organizacion seleccionada
    const [loadingDefaultOrg, setLoadingDefaultOrg] = useState(false); //Loading del boton de set default org
    const [roleFixed, setRoleFixed] = useState([]); //Roles que se muestran en el dropdown
    const [selectedRole, setSelectedRole] = useState(undefined); //Rol seleccionado
    const [loadingDefaultRole, setLoadingDefaultRole] = useState(false) //Loading del boton de set default role
    const [user, setUser] = useState({
        name: '',
        surname: '',
        birth_date: '',
        email: '',
        password: '',
    });
    
    const navigate = useNavigate();
    
    const tooltip = <FontAwesomeIcon icon={faPenToSquare} size='1x' title={'Create Profile'} />;
    
    //Mapea los roles y organizaciones para que tengan el formato que necesita la lista
    const mapRolesAndOrgs = (data) => {
        let roles = [{
            id: 0,
            name: 'None'
        }];
        let orgs = [{
            id: 0,
            name: 'None',
        }];
        
        if (data.roles.length != 0) {
            roles = data.roles.map(role => ({ id: role.id, name: role.name }));
        }
        if (data.organizations.length != 0) {
            orgs = data.organizations.map(org => ({ id: org.id, name: org.name }));
        }

        return { roles, orgs };
    };
    
    //Carga los datos del usuario
    const loadUser = async () => {
        await userManagementApi.get("profile", { bearerToken: token })
        .then((response) => {
            //Si el usuario es un Client
            if(response.data.data.user.client) {
                setIsClient(true);
                const { roles, orgs } = mapRolesAndOrgs(response.data.data.user.client);
                setRoleList(roles);
                setOrgList(orgs);
                setUser({
                    ...user,
                    name: response.data.data.user.client.name,
                    email: response.data.data.user.email,
                    id: response.data.data.user.client.id
                });
                setOrgFixed(response.data.data.user.client.organizations);
                
                //Elimina el rol de admin de la lista de roles a seleccionar
                if(!isSuperAdmin) {
                    const roles = response.data.data.user.client.roles.filter(rol => rol.name !== 'Admin');
                    setRoleFixed(roles);
                } else {
                    setRoleFixed(response.data.data.user.client.roles);
                }
            //Si el usuario es un Member
            } else {
                const { roles, orgs } = mapRolesAndOrgs(response.data.data.user.member);
                setRoleList(roles);
                setOrgList(orgs);
                setUser({
                    name: response.data.data.user.member.name,
                    surname: response.data.data.user.member.surname,
                    birth_date: response.data.data.user.member.birth_date,
                    email: response.data.data.user.email,
                    id: response.data.data.user.member.id
                });
            }
        })
        .catch((error) => {
            XPopUp({
                message: `Error loading profile`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
        .finally(() => {
            setDataLoading(false);
        })
    }

    //Carga los datos del usuario cuando el token se haya cargado
    useEffect(() => {
        loadUser();
    }, [token]);

    //Actualiza el estado de los inputs
    const onInputChange = (e) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
        });
    }

    //Redirige a la pagina de cambio de contraseña
    const changePassword = () => {
        navigate('/changePassword');
    }

    //Envia los datos del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        const endpoint = isClient ? 'client' : 'member';
        userManagementApi.put(`${endpoint}/${user.id}`, user, { bearerToken: token })
        .then((response) => {
            XPopUp({
                message: `Profile updated`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });

        })
        .catch((error) => {
            XPopUp({
                message: `Error updating profile`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
    }

    //Envia una peticion put para actualizar la organizacion por defecto
    async function setDefaultOrg () {
        setLoadingDefaultOrg(true);
        if(!selectedOrg){
            XPopUp({
                message: `Select a organization first`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
            setLoadingDefaultOrg(false);
            return;
        }
        await userManagementApi.put(`client/${user.id}/organization/${selectedOrg.id}`, {}, { bearerToken: token })
        .then((response) => {
            XPopUp({
                message: `Default organization updated`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
        })
        .catch((error) => {
            XPopUp({
                message: `Error updating default organization`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
        .finally(() => {
            setLoadingDefaultOrg(false);
        })
    }

    //Envia una peticion put para actualizar el rol por defecto
    async function setDefaultRole () {
        setLoadingDefaultRole(true);
        if(!selectedRole){
            XPopUp({
                message: `Select a role first`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
            setLoadingDefaultRole(false);
            return;
        }
        await userManagementApi.put(`client/${user.id}/role/${selectedRole.id}`, {}, { bearerToken: token })
        .then((response) => {
            XPopUp({
                message: `Default role updated`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
        })
        .catch((error) => {
            XPopUp({
                message: `Error updating default role`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
        .finally(() => {
            setLoadingDefaultRole(false);
        })
    }

    return ( 
        <StyledForm onSubmit={handleSubmit}>
            {dataLoading ? (<CenteredSpinner top={"45%"} left={"45%"}/>)
                : (
                    <StyledPageContainer>
                        <h2>My profile</h2>
                        <XCard title='User data' tooltip={tooltip}>
                            {isClient ? 
                            <>
                                <StyledPageMarginContainer>
                                    <XInput id='name' type="text" label="Name" value={user.name} onChange={(e) => onInputChange(e)} fullWidth required/>
                                    <XInput id='email' type="email" label="Email" value={user.email} onChange={(e) => onInputChange(e)} fullWidth required sx={{mb: 4}}/>
                                    <XInput id='password' type="password" label="Password" value={user.password} onChange={(e) => onInputChange(e)} fullWidth required sx={{mb: 4}}/>
                                </StyledPageMarginContainer>
                            </> : 
                            <>
                                <StyledPageMarginContainer>
                                    <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                                        <XInput id='name' type="text" label="First Name" value={user.name} onChange={(e) => onInputChange(e)} fullWidth required/>
                                        <XInput id='surname' type="text" label="Last Name" value={user.surname} onChange={(e) => onInputChange(e)} fullWidth required/>
                                    </Stack>
                                    <XInput id='birth_date' type="date" label="Date of Birth" value={user.birth_date} onChange={(e) => onInputChange(e)} fullWidth required sx={{mb: 4}}/>
                                    <XInput id='email' type="email" label="Email" value={user.email} onChange={(e) => onInputChange(e)} fullWidth required sx={{mb: 4}}/>
                                </StyledPageMarginContainer>
                            </>}
                        </XCard>
                        <XCard title='My roles' tooltip={tooltip}>
                            <StyledPageMarginContainer>
                                <XList list={roleList}/>
                            </StyledPageMarginContainer>
                            {isClient ? 
                                <StyledPageMarginContainer>
                                    <XDropdown options={roleFixed} 
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onChange={(e, value) => setSelectedRole(value)}
                                        value={selectedRole}
                                        label='Default Role'
                                        multiple={false}
                                        labelOptions='name'
                                        hasCheckBoxes={false}
                                        bgColor='100'
                                        renderOption={(option) => `${option.name}`}/>
                                        <LoadingButton loading={loadingDefaultRole} variant="contained" onClick={setDefaultRole}>
                                            <span>Set default role</span>
                                        </LoadingButton>
                                </StyledPageMarginContainer> : null}
                        </XCard>
                        <XCard title='My organizations' tooltip={tooltip}>
                            <StyledPageMarginContainer>
                                <XList list={orgList}/>
                            </StyledPageMarginContainer>
                            {isClient && orgsFixed > 0 ? 
                                <StyledPageMarginContainer>
                                    <XDropdown options={orgsFixed} 
                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                        onChange={(e, value) => setSelectedOrg(value)}
                                        value={selectedOrg}
                                        label='Default Organization'
                                        multiple={false}
                                        labelOptions='name'
                                        hasCheckBoxes={false}
                                        bgColor='100'
                                        renderOption={(option) => `${option.name}`}/>
                                        <LoadingButton loading={loadingDefaultOrg} variant="contained" onClick={setDefaultOrg}>
                                            <span>Set default organization</span>
                                        </LoadingButton>
                                </StyledPageMarginContainer> : null }
                        </XCard>
                        <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                            <LoadingButton loading={loading} variant="contained" type="submit">
                                <span>Edit profile</span>
                            </LoadingButton>
                            <Button variant="contained" onClick={changePassword}>Change password</Button>
                        </Stack>
                    </StyledPageContainer>
            )}
        </StyledForm>
    ); 
} 
export default Profile; 