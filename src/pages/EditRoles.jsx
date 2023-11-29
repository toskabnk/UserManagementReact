import { useState, useEffect } from "react";
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from "../services/apiServices";
import { useSelector } from 'react-redux';
import RoleForm from "../components/RoleForm";
import { XPopUp } from "@ximdex/xui-react/material";
import { useSearchParams } from "react-router-dom";


function EditRole() {
    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const token = useSelector((state) => state.user.access_token);
    const [dataLoading, isDataLoading] = useState(true)
    const [membersFixed, setMembersFixed] = useState([])
    const [clientsFixed, setClientsFixed] = useState([])
    const [selectedMembers, setSelectedMembers] = useState([])
    const [selectedClients, setSelectedClients] = useState([])
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState({
        name : '',
        clients : [],
        members : []
    })

    const getMembers = async() => {
        await userManagementApi
        .get("member", { bearerToken: token })
        .then((response) => {
            let data = response.data.data;
            data.members.forEach(member => {
                member.email = member.user.email;
            });
            setMembersFixed(data.members)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const getClients = async() => {
        await userManagementApi
        .get("client", { bearerToken: token })
        .then((response) => {
            setClientsFixed(response.data.data.clients)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const getRole = async() => {
        await userManagementApi
        .get(`role/${id}`, { bearerToken: token })
        .then((response) => {
            const data = response.data.data;
            console.log(data)
            setRole(data.role)
            data.role.members.forEach(member => {
                member.email = member.user.email;
            });
            setSelectedMembers(data.role.members)
            setSelectedClients(data.role.clients)
            isDataLoading(false);
        })
        .catch((error) => {
            console.log(error);
            isDataLoading(false);
        })
    }

    function handleSubmit(event) {
        event.preventDefault();
        putData();
    }

    const putData = async() => {
        setLoading(true)
        await userManagementApi.put(`role/${id}`, role, { bearerToken: token })
        .then((response) => {
            setLoading(false)
            XPopUp({
                message: `Role updated!`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
        })
        .catch((error) => {
            console.log(error);
            XPopUp({
                message: `Error editing role`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
            setLoading(false);
        })
    }

    useEffect(() => {
      getClients();
      getMembers();
      getRole();
    }, [])

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
            />
        </StyledFullCenter>
    )
}

export default EditRole