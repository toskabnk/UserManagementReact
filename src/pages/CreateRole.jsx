import { useState, useEffect } from "react";
import { StyledFullCenter } from "../styles/Containers";
import userManagementApi from "../services/apiServices";
import { useSelector } from 'react-redux';
import RoleForm from "../components/RoleForm";
import { XPopUp } from "@ximdex/xui-react/material";


function CreateRole() {
    const token = useSelector((state) => state.user.access_token);
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

    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    const postData = async() => {
        setLoading(true)
        await userManagementApi.post("role", role, { bearerToken: token })
        .then((response) => {
            setLoading(false)
            XPopUp({
                message: `Role created`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
            setRole({
                name: "",
                clients: [],
                members: []
            });
            setSelectedClients([]);
            setSelectedMembers([]);
        })
        .catch((error) => {
            console.log(error);
            XPopUp({
                message: `Error creating role`,
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
            handleSubmit={handleSubmit}
            />
        </StyledFullCenter>
    )
}

export default CreateRole