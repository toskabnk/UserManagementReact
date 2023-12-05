import {useEffect, useState} from 'react';
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from '../services/apiServices';
import { useSelector } from 'react-redux';
import { XPopUp } from '@ximdex/xui-react/material';
import ClientForm from '../components/ClientForm';
import { useSearchParams } from 'react-router-dom';
import ErrorsModal from '../components/ErrorsModal';

const EditClient = () => {
    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const token = useSelector((state) => state.user.access_token);

    const [dataLoading, setDataLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const [openModal,setOpenModal] = useState(false);
    const [rolesFixed, setRolesFixed] = useState([]); //Roles que se muestran en el dropdown
    const [selectedRoles, setSelectedRoles] = useState([]); //Roles seleccionados
    const [loading, setLoading] = useState(false)
    const [client, setClient] = useState({
        name: "",
        email: "",
        password: null,
    })

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

    //Al cargar la página, consigue los roles y los datos del cliente
    useEffect(() => {
        loadClient();
        getRoles();
    }, [])

    //Al cambiar los roles seleccionados, actualiza los roles del cliente
    useEffect(() => {
        const selectedRolesIds = selectedRoles.map(role => role.id);
        client.roles = selectedRolesIds;
    }, [selectedRoles])

    //Ejecuta la función putData al hacer submit
    function handleSubmit(event) {
        event.preventDefault();
        putData();
    }

    //Consigue los datos del cliente
    const loadClient = async() => {
        await userManagementApi.get(`client/${id}`, { bearerToken: token })
        .then((response) => {
            const client = response.data.data.client;
            setClient({
                name: client.name,
                email: client.user.email,    
            })
            setSelectedRoles(client.roles);
            setDataLoading(false);
        })
        .catch((error) => {
            setDataLoading(false);
            XPopUp({
                message: `Error loading client`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
    }

    //Envia una peticion put con los datos del cliente
    const putData = async() => {
        setLoading(true);
        
        //Creación del objeto body con los datos del cliente
        const body = {
            name: client.name,
            email: client.email,
            roles: client.roles,
            password_change: client.password,
        };

        //Eliminar nulos o undefined
        Object.keys(body).forEach(key => body[key] == null && delete body[key]);

        await userManagementApi.put(`client/${id}`, body, { bearerToken: token })
        .then((response) => {
            XPopUp({
                message: `Client edtied`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false);
            XPopUp({
                message: `Error editing the client`,
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
            <ClientForm
            client={client}
            setClient={setClient}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            rolesFixed={rolesFixed}
            loading={loading} 
            handleSubmit={handleSubmit}
            edit={true}
            dataLoading={dataLoading}
            />
            <ErrorsModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            errors={errors}
            />
        </StyledFullCenter>
    )
}

export default EditClient;