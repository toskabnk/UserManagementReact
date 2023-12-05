import { useEffect, useState } from "react";
import userManagementApi from "../services/apiServices";
import { StyledFullCenter } from "../styles/Containers";
import { useSelector } from "react-redux";
import OrganizationForm from "../components/OrganizationForm";
import { XPopUp } from "@ximdex/xui-react/material";
import { useAuth } from "../providers/AuthProvider/AuthContext";

const CreateOrganization = () => {
    const { isSuperAdmin } = useAuth();
    const token = useSelector((state) => state.user.access_token);
   
    const [loading, setLoading] = useState(false);
    const [clientsFixed, setClientsFixed] = useState([]); //Clientes que se muestran en el dropdown
    const [selectedClient, setSelectedClient] = useState(undefined); //Cliente seleccionado
    const [organization, setOrganization] = useState(
        {
            name: '',
            description: '',
            client_id: null
        }
    );
        
    //Ejecuta la función postData al hacer submit
    function handleSubmit(event) {
        event.preventDefault();
        postData();
    }

    //Envia una peticion post con los datos de la organización
    const postData = async() => {
        setLoading(true)

        //Elimina las propiedades con valor null
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

            //Resetea los campos del formulario
            setOrganization({
                name: '',
                description: '',
                client_id: null
            })
            setSelectedClient(undefined)
        })
        .catch((error) => {
            setLoading(false)
            XPopUp({
                message: `Error creating the organization`,
                iconType: "error",
                timer: "3000",
                popUpPosition: "top",
                iconColor: "red",
            });
        })
    }

    //Al seleccionar un cliente, se guarda en el objeto organization si no es nulo o undefined
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

    //Obtiene los clientes del superadmin
    const getClients = async() => {
        await userManagementApi.get("client", { bearerToken: token })
        .then((response) => {
            setClientsFixed(response.data.data.clients)
        })
        .catch((error) => {
            console.log(error);
        })
    } 

    //Si es superAdmin, obtiene los clientes
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