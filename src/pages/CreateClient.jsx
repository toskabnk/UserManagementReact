import {useEffect, useState} from 'react';
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from '../services/apiServices';
import { useSelector } from 'react-redux';
import { XPopUp } from '@ximdex/xui-react/material';
import ErrorsModal from '../components/ErrorsModal';
import ClientForm from '../components/ClientForm';

function CreateClient() {
    const token = useSelector((state) => state.user.access_token);
    const [errors, setErrors] = useState(null);
    const [openModal,setOpenModal] = useState(false);
    const [rolesFixed, setRolesFixed] = useState([]); //Roles que se muestran en el dropdown
    const [selectedRoles, setSelectedRoles] = useState([]); //Roles seleccionados
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);
    const [client, setClient] = useState({
        name: "",
        email: "",
        organization_name: "",
        organization_description: "",
        password:"",
        password2: ""
    })

    //Consigue los todos los roles existentes
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

    //Carga los roles al cargar la página
    useEffect(() => {
      getRoles();
    }, [])

    //Al cambiar los roles seleccionados, se actualizan en el objeto client
    useEffect(() => {
        const selectedRolesIds = selectedRoles.map(role => role.id);
        client.roles = selectedRolesIds;
    }, [selectedRoles])

    //Ejecuta la función postData al hacer submit
    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    //Envia una peticion post con los datos del cliente
    const postData = async() => {
        setLoading(true);

        //Creación del objeto body con los datos del cliente
        const body = {
            name: client.name,
            email: client.email,
            password: client.password,
            password_confirmation: client.password2,
            roles: client.roles,
            organization_name: client.organization_name,
            organization_description: client.organization_description
        };

        //Elimina los campos vacíos del objeto body
        Object.keys(body).forEach(key => body[key] == null && delete body[key]);

        await userManagementApi.post("client", body, { bearerToken: token })
        .then((response) => {
            XPopUp({
                message: `Client created`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });

            setLoading(false);

            //Resetea los campos del formulario
            setClient({
                name: "",
                email: "",
                password:"",
                password2: "",
                organization_name: '',
                organization_description: '',
                roles: [],
            });
            setSelectedRoles([]);
        })
        .catch((error) => {
            setLoading(false);
            XPopUp({
                message: `Error creating the client`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });

            //Si hay errores de validación, se muestran en el modal
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
            <ClientForm
            client={client}
            setClient={setClient}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            rolesFixed={rolesFixed}
            loading={loading} 
            handleSubmit={handleSubmit}
            isDisabled={isDisabled}
            />
            <ErrorsModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            errors={errors}
            />
        </StyledFullCenter>
    )
}

export default CreateClient;