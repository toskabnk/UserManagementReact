import { useEffect, useState } from "react";
import userManagementApi from "../services/apiServices";
import { useSelector } from "react-redux";
import OrganizationForm from "../components/OrganizationForm";
import { useSearchParams } from 'react-router-dom';

import { XPopUp } from "@ximdex/xui-react/material";
import { StyledFullCenter } from "../styles/Containers";
import { useAuth } from "../providers/AuthProvider/AuthContext";

const EditOrganization = () => {
    const token = useSelector((state) => state.user.access_token);
    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { isSuperAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [clientsFixed, setClientsFixed] = useState([])
    const [selectedClient, setSelectedClient] = useState(undefined)
    const [organization, setOrganization] = useState(
        {
            name: '',
            description: '',
            client_id: null
        }
    );

    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    const postData = async() => {
        setLoading(true)

        Object.keys(organization).forEach((key) => (organization[key] == null) && delete organization[key]);

        await userManagementApi.put(`organization/${id}`, organization, { bearerToken: token })
        .then((response) => {
            setLoading(false)
            XPopUp({
                message: `Organization edoted`,
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

    const getOrganization = async() => {
        await userManagementApi
        .get(`organization/${id}`, { bearerToken: token })
        .then((response) => {
            console.log(response)
            setOrganization(response.data.data.organization)
            setSelectedClient(response.data.data.organization.client)
            setDataLoading(false)
        })
        .catch((error) => {
            console.log(error);
            setDataLoading(false)
        })
    }

    useEffect(() => {
        if(isSuperAdmin) {
            getClients();
        }
        getOrganization();
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
            edit={true}
            dataLoading={dataLoading}
            />
        </StyledFullCenter>
    )
}

export default EditOrganization;