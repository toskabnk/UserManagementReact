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
    const [rolesFixed, setRolesFixed] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [loading, setLoading] = useState(false)
    const [client, setClient] = useState({
        name: "",
        email: "",
    })
    const {name, email, roles} = client;

    const getRoles = async() => {
        await userManagementApi
        .get("role", { bearerToken: token })
        .then((response) => {
            console.log(response)
            setRolesFixed(response.data.data.roles)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        loadClient();
        getRoles();
    }, [])

    useEffect(() => {
        const selectedRolesIds = selectedRoles.map(role => role.id);
        client.roles = selectedRolesIds;
        console.log(client)
    }, [selectedRoles])

    function handleSubmit(event) {
        event.preventDefault();
        putData();
    }

    const loadClient = async() => {
        await userManagementApi
        .get(`client/${id}`, { bearerToken: token })
        .then((response) => {
            console.log(response)
            const client = response.data.data.client;
            setClient({
                name: client.name,
                email: client.user.email,    
            })
            setSelectedRoles(client.roles);
            setDataLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setDataLoading(false);
        })
    }

    const putData = async() => {
        console.log(client)
        setLoading(true);
        const body = {
            name: name,
            email: email,
            roles: client.roles,
        };
        await userManagementApi
        .put(`client/${id}`, body, { bearerToken: token })
        .then((response) => {
            console.log(response)
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
            console.log(error);
            setLoading(false);
            XPopUp({
                message: `Error editing the client`,
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