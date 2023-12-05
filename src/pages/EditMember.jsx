import {useEffect, useState} from 'react';
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from '../services/apiServices';
import { useSelector } from 'react-redux';
import { XPopUp } from '@ximdex/xui-react/material';
import UserForm from '../components/UserForm';
import { useSearchParams } from 'react-router-dom';
import ErrorsModal from '../components/ErrorsModal';

const EditMember = () => {
    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const token = useSelector((state) => state.user.access_token);
    
    const [errors, setErrors] = useState(null);
    const [openModal,setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [dataLoading, isDataLoading] = useState(true)
    const [orgFixed, setOrgFixed] = useState([]); //Organizaciones que se muestran en el dropdown
    const [selectedOrgs, setSelectedOrgs] = useState([]); //Organizaciones seleccionadas
    const [rolesFixed, setRolesFixed] = useState([]); //Roles que se muestran en el dropdown
    const [selectedRoles, setSelectedRoles] = useState([]); //Roles seleccionados
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

    const getUser = async(id) => {
        isDataLoading(true);
        
        await userManagementApi.get(`member/${id}`, { bearerToken: token })
        .then((response) => {
            const data = response.data.data.member;

            //Guardamos los datos del usuario en el estado
            setUser(
                {
                    name: data.name,
                    surname: data.surname,
                    birthDate: data.birth_date,
                    email: data.user.email,
                    password:"",
                    password2: "",
                    roles: data.roles,
                    organizations: data.organizations
                }
            )
            setSelectedOrgs(data.organizations)
            setSelectedRoles(data.roles)
        })
        .catch((error) => {
            XPopUp({
                message: `Error loading member`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
        .finally(() => {
            isDataLoading(false);
        })
    }

    //Al cargar la pagina, consigue los roles y organizaciones del cliente actual y los datos del member
    useEffect(() => {
      getRoles();
      getOrganizations();
      getUser(id);
    }, [])

    //Cada vez que se cambia el estado de selectedRoles o selectedOrgs, se actualiza el estado de user
    useEffect(() => {
        const selectedRolesIds = selectedRoles.map(role => role.id);
        const selectedOrgIds = selectedOrgs.map(org => org.id);
        setRoles(selectedRolesIds);
        setOrgs(selectedOrgIds);
    }, [selectedOrgs, selectedRoles])

    //Funcion que se ejecuta al enviar el formulario
    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    //Envia una peticion post con los datos del role
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
            organizations: orgs
        };

        await userManagementApi.put(`member/${id}`, body, { bearerToken: token })
        .then((response) => {
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
            const responseData = error.response.data;
            XPopUp({
                message: `Error editing the user`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });

            //Si hay errores de validación, se muestran en un modal
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

export default EditMember;