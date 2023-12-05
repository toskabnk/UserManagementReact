import { useState, useEffect } from "react";
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from "../services/apiServices";
import { useSelector } from 'react-redux';
import RoleForm from "../components/RoleForm";
import { XPopUp } from "@ximdex/xui-react/material";
import { useAuth } from "../providers/AuthProvider/AuthContext";


function CreateRole() {
    const token = useSelector((state) => state.user.access_token);
    const { isSuperAdmin } = useAuth();
    const [membersFixed, setMembersFixed] = useState([]); //Members que se muestran en el dropdown
    const [clientsFixed, setClientsFixed] = useState([]); //Clients que se muestran en el dropdown
    const [selectedMembers, setSelectedMembers] = useState([]); //Members seleccionados
    const [selectedClients, setSelectedClients] = useState([]); //Clients seleccionados
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState({
        name : '',
        clients : [],
        members : []
    })

    //Consigue los members del cliente actual
    const getMembers = async() => {
        await userManagementApi
        .get("member", { bearerToken: token })
        .then((response) => {
            let data = response.data.data;
            //Añade la propiedad email a cada member
            data.members.forEach(member => {
                member.email = member.user.email;
            });
            setMembersFixed(data.members)
        })
        .catch((error) => {
            XPopUp({
                message: `Error loading members`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
    }

    //Consigue los clients del cliente actual
    const getClients = async() => {
        await userManagementApi.get("client", { bearerToken: token })
        .then((response) => {
            setClientsFixed(response.data.data.clients)
        })
        .catch((error) => {
            XPopUp({
                message: `Error loading clients`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
    }

    //Ejecuta la función postData al hacer submit
    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    //Envia una peticion post con los datos del role
    const postData = async() => {
        setLoading(true)
        await userManagementApi.post("role", role, { bearerToken: token })
        .then((response) => {
            XPopUp({
                message: `Role created`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });

            //Resetea los campos del formulario
            setRole({
                name: "",
                clients: [],
                members: []
            });
            setSelectedClients([]);
            setSelectedMembers([]);
        })
        .catch((error) => {
            XPopUp({
                message: `Error creating role`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
        .finally(() => {
            setLoading(false);
        })
    }

    //Obtiene los clients y members al cargar la pagina
    useEffect(() => {
      getClients();
      getMembers();
    }, [])

    //Al cambiar el estado de selectedMembers o selectedClients, se actualizan los valores de role
    useEffect(() => {
        const selectedMembersIds = selectedMembers.map(members => members.id);
        const selectedClientsIds = selectedClients.map(client => client.id);
        role.members = selectedMembersIds;
        role.clients = selectedClientsIds;
    }, [selectedMembers, selectedClients])
    
    return (
        <StyledFullCenter>
            <RoleForm
            role = {role}
            setRole={setRole}
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
            selectedClients={selectedClients}
            setSelectedClients={setSelectedClients}
            membersFixed={membersFixed}
            clientsFixed={clientsFixed}
            loading={loading}
            handleSubmit={handleSubmit}
            superAdmin={isSuperAdmin}
            />
        </StyledFullCenter>
    )
}

export default CreateRole