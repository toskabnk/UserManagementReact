import React, { useEffect, useState } from 'react';
import { StyledForm } from '../styles/FormStyles';
import { CenteredSpinner } from '../styles/Spinner';
import LoadingButton from '@mui/lab/LoadingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { StyledPageContainer, StyledPageMarginContainer } from '../styles/Containers';
import { XCard, XInput, XList, XPopUp } from '@ximdex/xui-react/material';
import userManagementApi from '../services/apiServices';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/material';

function User() { 
    const token = useSelector((state) => state.user.access_token);
    const [dataLoading, setDataLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [user, setUser] = useState({
        name: '',
        surname: '',
        birth_date: '',
        email: '',
        password: '',
    });
    const [roleList, setRoleList] = useState([]);
    const [orgList, setOrgList] = useState([]);
    
    const tooltip = <FontAwesomeIcon icon={faPenToSquare} size='1x' title={'Create Profile'} />;
    
    const mapRolesAndOrgs = (data) => {
        let roles = [{
            id: 0,
            name: 'None'
        }];
        let orgs = [{
            id: 0,
            name: 'None'
        }];
        
        if (data.roles != null) {
            roles = data.roles.map(role => ({ id: role.id, name: role.name }));
        }
        if (!data.organizations != null) {
            orgs = data.organizations.map(org => ({ id: org.id, name: org.name }));
        }

        return { roles, orgs };
    };
    
    const loadUser = async () => {
        await userManagementApi.get("profile", { bearerToken: token })
        .then((response) => {
            console.log(response);
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
            setDataLoading(false);
            console.log(user);
        })
        .catch((error) => {
            console.log(error);
            setDataLoading(false);
        })
    }

    useEffect(() => {
        loadUser();
    }, [token]);

    const onInputChange = (e) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(user);
        const endpoint = isClient ? 'client' : 'member';
        userManagementApi.put(`${endpoint}/${user.id}`, user, { bearerToken: token })
        .then((response) => {
            console.log(response);
            XPopUp({
                message: `Profile updated`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });

        })
        .catch((error) => {
            console.log(error);
            XPopUp({
                message: `Error updating profile`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
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
                        </XCard>
                        <XCard title='My organizations' tooltip={tooltip}>
                            <StyledPageMarginContainer>
                                <XList list={orgList}/>
                            </StyledPageMarginContainer>
                        </XCard>
                        <LoadingButton loading={loading} variant="contained" type="submit">
                            <span>Edit profile</span>
                        </LoadingButton>
                    </StyledPageContainer>
            )}
        </StyledForm>
    ); 
} 
export default User; 