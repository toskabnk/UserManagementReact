import {useEffect, useState} from 'react';
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from '../services/apiServices';
import { useSelector } from 'react-redux';
import User from '../models/User';
import { XPopUp } from '@ximdex/xui-react/material';
import UserForm from '../components/UserForm';
import ErrorsModal from '../components/ErrorsModal';


function CreateUser() {
    const token = useSelector((state) => state.user.access_token);
    const [errors, setErrors] = useState(null);
    const [openModal,setOpenModal] = useState(false);
    const [rolesFixed, setRolesFixed] = useState([]);
    const [orgFixed, setOrgFixed] = useState([]);
    const [loading, setLoading] = useState(false)
    const [selectedOrgs, setSelectedOrgs] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [user, setUser] = useState({
        name: "",
        surname: "",
        birthDate: "",
        email: "",
        password:"",
        password2: "",
        roles: [],
        organizations: []
    })
    const {name, surname, birthDate, email, password, password2, roles, organizations} = user;

    const getRoles = async() => {
        await userManagementApi
        .get("role", { bearerToken: token })
        .then((response) => {
            console.log(`Role response: ${response}`)
            setRolesFixed(response.data.data.role)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const getOrganizations = async() => {
        await userManagementApi
        .get("organization", { bearerToken: token })
        .then((response) => {
            console.log(`Organizations response: ${response}`)
            setOrgFixed(response.data.data.organization)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
      getRoles();
      getOrganizations();
    }, [])

    useEffect(() => {
        const selectedRolesIds = selectedRoles.map(role => role.id);
        const selectedOrgIds = selectedOrgs.map(org => org.id);
        user.roles = selectedRolesIds;
        user.organizations = selectedOrgIds;
        console.log(user)
    }, [selectedOrgs, selectedRoles])

    function handleSubmit(event) {
        event.preventDefault();
        postData();
        
    }

    const postData = async() => {
        setLoading(true);
        const userDTO = {
            name: name,
            surname: surname,
            birth_date: birthDate,
            email: email,
            password: password,
            password_confirmation: password2,
            roles: roles,
            organizations: organizations
        };
            
        let user = new User(userDTO);
        const body = user.toDTO();
        await userManagementApi
        .post("user", body, { bearerToken: token })
        .then((response) => {
            console.log(`Data response: ${response}`)
            XPopUp({
                message: `User created`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
            setLoading(false);
            setUser({
                name: "",
                surname: "",
                birthdate: "",
                email: "",
                password:"",
                password2: "",
                roles: [],
                organizations: []
            });
            setSelectedOrgs([]);
            setSelectedRoles([]);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
            XPopUp({
                message: `Error creating the user`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
            const responseData = error.response.data;
            if (responseData.data && responseData.data.errors) {
                const validationErrors = responseData.data.errors;
                setErrors(validationErrors);
                setOpenModal(true);
            }
            setLoading(false);
            setLoading(false);
        })
    }

    return (
        <StyledFullCenter>
            <UserForm
            user={user}
            setUser={setUser}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            selectedOrgs={selectedOrgs} 
            setSelectedOrgs={setSelectedOrgs} 
            rolesFixed={rolesFixed}
            orgFixed={orgFixed}
            loading={loading} 
            handleSubmit={handleSubmit}
            />
            <ErrorsModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            errors={errors}
            />
        </StyledFullCenter>
    )
}

export default CreateUser;