import { useEffect, useState } from "react";
import userManagementApi from "../services/apiServices";
import { useNavigate } from "react-router-dom";
import { StyledFullCenter } from "../styles/Containers";
import { useSelector } from "react-redux";
import OrganizationForm from "../components/OrganizationForm";
import { XPopUp } from "@ximdex/xui-react/material";
import { useAuth } from "../providers/AuthProvider/AuthContext";


const CreateOrganization = () => {
    const token = useSelector((state) => state.user.access_token);
    const { isSuperAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [clientsFixed, setClientsFixed] = useState([])
    const [selectedClient, setSelectedClient] = useState(undefined)
    const [organization, setOrganization] = useState(
        {
            name: '',
            description: '',
            client_id: null
        }
    );
    
    const navigate = useNavigate();
    
    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    const postData = async() => {
        setLoading(true)

        Object.keys(organization).forEach((key) => (organization[key] == null) && delete organization[key]);

        await userManagementApi.post("organization", organization, { bearerToken: token })
        .then((response) => {
            setLoading(false)
            XPopUp({
                message: `Organization created`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
            setOrganization({
                name: '',
                description: '',
                client_id: null
            })
            setSelectedClient(undefined)
        })
        .catch((error) => {
            setLoading(false)
            console.log(error)
        })
    }

    useEffect(() => {
        if (selectedClient === undefined) {
            return;
        } else {
            if(selectedClient === null) {
                setSelectedClient(undefined);
            } else {
                organization.client_id = selectedClient.id;
            }
        }
    }, [selectedClient])

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

    useEffect(() => {
        if(isSuperAdmin) {
            getClients();
        }
      }, [isSuperAdmin])
    
    return (
        <StyledFullCenter>
            <OrganizationForm
            organization = {organization}
            setOrganization={setOrganization}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            clientsFixed={clientsFixed}
            loading={loading}
            handleSubmit={handleSubmit}
            isSuperAdmin={isSuperAdmin}
            />
        </StyledFullCenter>
    );
};

export default CreateOrganization;