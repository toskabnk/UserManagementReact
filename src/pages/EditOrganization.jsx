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
    const { isSuperAdmin } = useAuth();
    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [clientsFixed, setClientsFixed] = useState([]); //Clients que se muestran en el dropdown
    const [selectedClient, setSelectedClient] = useState(undefined); //Client seleccionado
    const [organization, setOrganization] = useState(
        {
            name: '',
            description: '',
            client_id: null
        }
    );

    //Envia los datos del formulario
    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    //Envia una peticion post con los datos del formulario
    const postData = async() => {
        setLoading(true)

        //Elimina las propiedades con valor null
        Object.keys(organization).forEach((key) => (organization[key] == null) && delete organization[key]);

        await userManagementApi.put(`organization/${id}`, organization, { bearerToken: token })
        .then((response) => {
            setLoading(false)
            XPopUp({
                message: `Organization edited`,
                iconType: "success",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "ligthgreen",
            });
        })
        .catch((error) => {
            XPopUp({
                message: `Error editing organization`,
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

    //Actualiza el valor de la propiedad client_id del objeto organization
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


    //Obtiene los clients
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

    //Obtiene la organizacion
    const getOrganization = async() => {
        await userManagementApi.get(`organization/${id}`, { bearerToken: token })
        .then((response) => {
            setOrganization(response.data.data.organization)
            setSelectedClient(response.data.data.organization.client)
        })
        .catch((error) => {
            XPopUp({
                message: `Error loading organization`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
        .finally(() => {
            setDataLoading(false)
        })
    }

    //Al cargar la pagina, carga la organizaciones y consigue los clients si es superAdmin
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
            isSuperAdmin={isSuperAdmin}
            />
        </StyledFullCenter>
    )
}

export default EditOrganization;