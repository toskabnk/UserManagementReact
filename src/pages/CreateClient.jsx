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
    const [rolesFixed, setRolesFixed] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
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
    const {name, email, password, password2, roles, organization_name, organization_description} = client;

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
      getRoles();
    }, [])

    useEffect(() => {
        const selectedRolesIds = selectedRoles.map(role => role.id);
        client.roles = selectedRolesIds;
        console.log(client)
    }, [selectedRoles])

    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    const postData = async() => {
        setLoading(true);
        const body = {
            name: name,
            email: email,
            password: password,
            password_confirmation: password2,
            roles: roles,
            organization_name: organization_name,
            organization_description: organization_description
        };
        await userManagementApi
        .post("client", body, { bearerToken: token })
        .then((response) => {
            console.log(`Data response: ${response}`)
            XPopUp({
                message: `Client created`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
            setLoading(false);
            setClient({
                name: "",
                email: "",
                password:"",
                password2: "",
                organization_name: "",
                organization_description: "",
                roles: [],
            });
            setSelectedRoles([]);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
            XPopUp({
                message: `Error creating the client`,
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