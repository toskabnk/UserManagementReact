import {useEffect, useState} from 'react';
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from '../services/apiServices';
import { useSelector } from 'react-redux';
import { XPopUp } from '@ximdex/xui-react/material';
import UserForm from '../components/UserForm';
import ErrorsModal from '../components/ErrorsModal';

function CreateMember() {
    const token = useSelector((state) => state.user.access_token);
    const [errors, setErrors] = useState(null);
    const [openModal,setOpenModal] = useState(false);
    const [rolesFixed, setRolesFixed] = useState([]); //Roles que se muestran en el dropdown
    const [orgFixed, setOrgFixed] = useState([]); //Organizaciones que se muestran en el dropdown
    const [loading, setLoading] = useState(false)
    const [selectedOrgs, setSelectedOrgs] = useState([]); //Organizaciones seleccionadas
    const [selectedRoles, setSelectedRoles] = useState([]); //Roles seleccionados
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

    //Consigue los roles del cliente actual
    const getRoles = async() => {
        await userManagementApi.get("role", { bearerToken: token })
        .then((response) => {
            setRolesFixed(response.data.data.roles)
        })
        .catch((error) => {
            XPopUp({
                message: `Error loading roles`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
    }

    //Consigue las organizaciones del cliente actual
    const getOrganizations = async() => {
        await userManagementApi.get("organization", { bearerToken: token })
        .then((response) => {
            setOrgFixed(response.data.data.organizations)
        })
        .catch((error) => {
            XPopUp({
                message: `Error loading organizations`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
    }

    //Al cargar la pagina, consigue los roles y organizaciones del cliente actual
    useEffect(() => {
      getRoles();
      getOrganizations();
    }, [])

    //Cada vez que se cambia el estado de selectedRoles o selectedOrgs, se actualiza el estado de user
    useEffect(() => {
        const selectedRolesIds = selectedRoles.map(role => role.id);
        const selectedOrgIds = selectedOrgs.map(org => org.id);
        user.roles = selectedRolesIds;
        user.organizations = selectedOrgIds;
    }, [selectedOrgs, selectedRoles])

    //Funcion que se ejecuta al enviar el formulario
    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    //Envia los datos del usuario
    const postData = async() => {
        setLoading(true);

        //Creación del objeto body con los datos del usuario
        const body = {
            name: name,
            surname: surname,
            birth_date: birthDate,
            email: email,
            password: password,
            password_confirmation: password2,
            roles: roles,
            organizations: organizations
        };
        await userManagementApi.post("member", body, { bearerToken: token })
        .then((response) => {
            XPopUp({
                message: `User created`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
            setLoading(false);

            //Resetea los campos del formulario
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
            setLoading(false);
            XPopUp({
                message: `Error creating the user`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });

            //Muestra los errores de validación
            const responseData = error.response.data;
            if (responseData.data && responseData.data.errors) {
                const validationErrors = responseData.data.errors;
                setErrors(validationErrors);
                setOpenModal(true);
            }
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

export default CreateMember;