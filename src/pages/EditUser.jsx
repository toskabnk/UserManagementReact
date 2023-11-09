import {useEffect, useState} from 'react';
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from '../services/apiServices';
import { useSelector } from 'react-redux';
import User from '../models/User';
import { XPopUp } from '@ximdex/xui-react/material';
import UserForm from '../components/UserForm';
import { useSearchParams } from 'react-router-dom';
import ErrorsModal from '../components/ErrorsModal';

const EditUser = () => {
    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const token = useSelector((state) => state.user.access_token);
    const [rolesFixed, setRolesFixed] = useState([]);
    const [errors, setErrors] = useState(null);
    const [openModal,setOpenModal] = useState(false);
    const [orgFixed, setOrgFixed] = useState([]);
    const [loading, setLoading] = useState(false)
    const [dataLoading, isDataLoading] = useState(true)
    const [selectedOrgs, setSelectedOrgs] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [orgs, setOrgs] = useState([]);
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
    const {name, surname, birthDate, email, password, password2} = user;

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

    const getUser = async(id) => {
        isDataLoading(true);
        await userManagementApi
        .get(`user/${id}`, { bearerToken: token })
        .then((response) => {
            console.log(response)
            setUser(new User(response.data.data.user))
            setSelectedOrgs(response.data.data.user.organizations)
            setSelectedRoles(response.data.data.user.roles)
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            isDataLoading(false);
        })
    }

    useEffect(() => {
      getRoles();
      getOrganizations();
      getUser(id);
    }, [])

    useEffect(() => {
        const selectedRolesIds = selectedRoles.map(role => role.id);
        const selectedOrgIds = selectedOrgs.map(org => org.id);
        setRoles(selectedRolesIds);
        setOrgs(selectedOrgIds);
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
            organizations: orgs
        };
        console.log(userDTO)    
        let user = new User(userDTO);
        const body = user.toDTO();
        console.log(body)
        setLoading(false);
        await userManagementApi
        .put(`user/admin/${id}`, body, { bearerToken: token })
        .then((response) => {
            console.log(`Data response: ${response}`)
            XPopUp({
                message: `User edited`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            const responseData = error.response.data;
            XPopUp({
                message: `Error creating the user`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
            if (responseData.data && responseData.data.errors) {
                const validationErrors = responseData.data.errors;
                setErrors(validationErrors);
                setOpenModal(true);
            }
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
            dataLoading={dataLoading}
            handleSubmit={handleSubmit}
            edit={true}
            />
            <ErrorsModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            errors={errors}
            />
        </StyledFullCenter>
    )
}

export default EditUser;