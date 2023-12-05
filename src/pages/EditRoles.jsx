import { useState, useEffect } from "react";
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from "../services/apiServices";
import { useSelector } from 'react-redux';
import RoleForm from "../components/RoleForm";
import { XPopUp } from "@ximdex/xui-react/material";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider/AuthContext";


function EditRole() {
    const { isSuperAdmin } = useAuth();
    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const token = useSelector((state) => state.user.access_token);

    const [dataLoading, isDataLoading] = useState(true); 
    const [membersFixed, setMembersFixed] = useState([]); //Members que se muestran en el dropdown
    const [clientsFixed, setClientsFixed] = useState([]); //Clients que se muestran en el dropdown
    const [selectedMembers, setSelectedMembers] = useState([]); //Members seleccionados
    const [selectedClients, setSelectedClients] = useState([]); //Clients seleccionados
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState({
        name : '',
        clients : [],
        members : []
    })

    //Consigue los miembros del cliente actual
    const getMembers = async() => {
        await userManagementApi.get("member", { bearerToken: token })
        .then((response) => {
            let data = response.data.data;

            //Añade la propiedad email a cada miembro
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

    //Consigue los clientes
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

    //Consigue el rol
    const getRole = async() => {
        await userManagementApi.get(`role/${id}`, { bearerToken: token })
        .then((response) => {
            const data = response.data.data;

            //Añade la propiedad email a cada miembro
            setRole(data.role)
            data.role.members.forEach(member => {
                member.email = member.user.email;
            });
            setSelectedMembers(data.role.members)
            setSelectedClients(data.role.clients)
        })
        .catch((error) => {
            XPopUp({
                message: `Error loading role`,
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

    //Envia los datos del formulario
    function handleSubmit(event) {
        event.preventDefault();
        putData();
    }

    //Envia una peticion put con los datos del formulario
    const putData = async() => {
        setLoading(true)
        
        await userManagementApi.put(`role/${id}`, role, { bearerToken: token })
        .then((response) => {
            XPopUp({
                message: `Role updated!`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
        })
        .catch((error) => {
            XPopUp({
                message: `Error editing role`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
        .finally(() => {
            setLoading(false)
        })
    }

    //Obtiene los miembros, clientes y los datos del rol
    useEffect(() => {
        getClients();
        if(isSuperAdmin) {
            getMembers();
            getRole();
        }
    }, [])

    //Actualiza el valor de la propiedad members y clients del objeto role
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
            edit={true}
            dataLoading={dataLoading}
            handleSubmit={handleSubmit}
            superAdmin={isSuperAdmin}
            />
        </StyledFullCenter>
    )
}

export default EditRole