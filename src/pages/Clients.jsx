import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faPlus, faParagraph, faAt } from "@fortawesome/free-solid-svg-icons";
import { StyledGreenXButton, StyledRedXButton, } from '@ximdex/xui-react/material/XRow/StyledXRow.js';
import { XRow, XRowDetails, XRowExtraDetails, XRowContent, XButton, XRadio, XInput, XPopUp} from '@ximdex/xui-react/material';
import { useSelector } from "react-redux";
import userManagementApi from "../services/apiServices";
import { StyledActivitiesListContainer, StyledDivFlexBetween, StyledDivFlexStartWrap, StyledFilterXCard, StyledFullCenter, StyledGrid, StyledSearchContainer } from "../styles/Containers";
import { StyledLink } from "../styles/StyledLink";
import { StyledFontAwesomeIcon } from "../styles/Icons";
import { Chip } from "@mui/material";
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";
import { CenteredSpinner } from "../styles/Spinner";
import Swal from "sweetalert2";

function Clients() { 
  const token = useSelector((state) => state.user.access_token);
  const [loading, isLoading] = useState(true);
  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState(""); //Valor del input de busqueda
  const [radioValue, setRadioValue] = useState("name"); //Valor inicial del filtro de busqueda
  
  const navigate = useNavigate();

  //Opciones para el filtro de busqueda
  const options = [
      { value: 'name', label: 'Name', icon: <FontAwesomeIcon icon={faParagraph} />},
      { value: 'email', label: 'Email', icon: <FontAwesomeIcon icon={faAt} />},
  ];

  //Elimina un cliente mostrando un mensaje para confirmar la accion
  const handleDeleteClient = (element) => {
    Swal.fire({
      title: 'Delete client',
      text: `Are you sure you want to delete the client ${element.name}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        userManagementApi.delete(`client/${element.id}`, {bearerToken: token})
          .then((response) => {
            getClients();
            XPopUp({
              message: `Client deleted`,
              iconType: "success",
              timer: "3000",
              popUpPosition: "top",
              iconColor: "ligthgreen",
            });
          }).catch((error) => {
            XPopUp({
              message:`Error deleting client`,
              iconType:'error',
              timer:'3000',
              popUpPosition:'top',
              iconColor: 'red',
            })
        })
      }
    })
  }

  //Redirige a la página de edición de un cliente
  const handleEditClient = (client) => {
    navigate(`/editClient?id=${client.id}`)
  }

  //Elimina un rol de un cliente mostrando un mensaje para confirmar la accion
  const handleRemoveRole = (client, role) => {
    Swal.fire({
      title: 'Remove role',
      text: `Are you sure you want to remove the role ${role.name} from the ${client.name}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        userManagementApi.delete(`client/${client.id}/role/${role.id}`, {bearerToken: token})
        .then((response) => {
          getClients();
          XPopUp({
            message: `Role removed`,
            iconType: "success",
            timer: "3000",
            popUpPosition: "top",
            iconColor: "ligthgreen",
          });
        }).catch((error) => {
          XPopUp({
            message:`Error removing role from the client`,
            iconType:'error',
            timer:'3000',
            popUpPosition:'top',
            iconColor: 'red',
          })
        })
      }
    })
  }

  //Redirige a la página de edición de un rol
  const handleEditRole = (role) => {
    navigate(`/editRole?id=${role.id}`)
  }

  //Elimina una organización de un cliente mostrando un mensaje para confirmar la accion
  const handleRemoveOrganization = (client, organization) => {
    Swal.fire({
      title: 'Remove organization',
      text: `Are you sure you want to remove the organization ${organization.name} from the ${client.name}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        userManagementApi.delete(`client/${client.id}/organization/${organization.id}`, {bearerToken: token})
        .then((response) => {
          getClients();
          XPopUp({
            message: `Organization removed`,
            iconType: "success",
            timer: "3000",
            popUpPosition: "top",
            iconColor: "ligthgreen",
          });
        }).catch((error) => {
          XPopUp({
            message:`Error removing organization from the client`,
            iconType:'error',
            timer:'3000',
            popUpPosition:'top',
            iconColor: 'red',
          })
        })
      }
    })
  }

  //Redirige a la página de edición de una organización
  const handleEditOrganization = (organization) => {
    navigate(`/editOrganization?id=${organization.id}`)
  }

  //Obtiene todos los clientes
  const getClients = async () => {
    async function fecthData() {
      isLoading(true);
      await userManagementApi.get("client", { bearerToken: token })
        .then((response) => {
          setData(response.data.data.clients);
        })
        .catch((error) => {
          XPopUp({
            message:`Error loading clients. Try again later.`,
            iconType:'error',
            timer:'3000',
            popUpPosition:'top',
            iconColor: 'red',
          })
        })
        .finally(() => {
          isLoading(false);
        });
    }
    fecthData();
  }

  //Obtiene los clientes que coincidan con el filtro de busqueda
  const search = async () => {
    async function fecthData() {
      isLoading(true);
      await userManagementApi.get(`client?${radioValue}=${searchValue}`, { bearerToken: token })
        .then((response) => {
          setData(response.data.data.clients);
        })
        .catch((error) => {
          XPopUp({
            message:`Error searching clients. Try again later.`,
            iconType:'error',
            timer:'3000',
            popUpPosition:'top',
            iconColor: 'red',
          })
        })
        .finally(() => {
          isLoading(false);
        });
    }
    fecthData();
  }

  //Al cargar la pagina, obtiene todos los clientes
  useEffect(() => {
    getClients();
  },[]);

  return (
    <StyledFullCenter>
      <StyledGrid>
        <StyledSearchContainer>
          <StyledFilterXCard
            isCollapsable={true}
            isCollapsed={false}
            title="Search By">
            <XRadio
              direction="column"
              value={radioValue}
              onChange={(e) => {
                setRadioValue(e.target.value);
              }}
              options={options}
              paddingXSize="s"
              style={{ paddingBottom: "0.5em" }}
            />
          </StyledFilterXCard>
        </StyledSearchContainer>
        <StyledActivitiesListContainer>
          <StyledDivFlexStartWrap>
            <XInput
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  search();
                }
              }}
              type="search"
              size="small"
              style={{
                width: "-webkit-fill-available",
                margin: "0",
                background: "#FBFBFB",
              }}
              placeholder={`Search by ${radioValue}`}
            />
          </StyledDivFlexStartWrap>
          <StyledDivFlexBetween>
            <Chip label={`${data ? data.length : "0"} clients`} />
            <StyledLink to={'/createClient'}>
              <XButton>
                <StyledFontAwesomeIcon
                  icon={faPlus}
                  title="Create a new client."
                  size="1x"
                  hasMarginRight={true}/>
                New client
              </XButton>
            </StyledLink>
          </StyledDivFlexBetween>
          {loading ? (
            <CenteredSpinner />
          ) : (
            <>
              {data ? (data.map((element, index) => (
                <XRow
                  name={`${element.name}${element.id}`}
                  key={index}
                  identifier={element.id}
                  isCollapsable={true}
                  labelButtonCollapsable={
                    <>
                      <p style={{ marginRight: "1em" }}>
                        {element.roles.length} roles
                      </p>
                      <Divider />
                      <p style={{ marginRight: "1em" }}>
                        {element.organizations.length} organizations
                      </p>
                    </>
                  }
                  controls={[
                    {
                      component: (
                        <StyledGreenXButton
                          key={"card_control" + index}
                          onClick={() => handleEditClient(element)}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            size="1x"
                            title="Edit client"
                          />
                        </StyledGreenXButton>
                      ),
                    },
                    {
                      component: (
                        <StyledRedXButton
                          key={"card_control" + index}
                          onClick={() => handleDeleteClient(element)}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            size="1x"
                            title="Remove client"
                          />
                        </StyledRedXButton>
                      ),
                    },
                  ]}
                >
                  <XRowContent key="XRowContent">
                    <p style={{ marginRight: "1em" }}>
                      Name: {element.name} ID: {element.id}
                    </p>
                    <p style={{ marginRight: "1em" }}>
                      Email: {element.user.email}
                    </p>
                  </XRowContent>
                  {/* <div className='detail-rows-container'> */}
                  {element.roles && element.roles.length > 0 ? (
                    <React.Fragment key={"XRowDetailsRoles"}>
                      {element.roles.map((role, roleIndex) => (
                        <XRowDetails
                          key={"XRowDetails" + roleIndex}
                          controlsDetails={[
                            {
                              component: (
                                <StyledGreenXButton
                                  onClick={() =>
                                    handleEditRole(role)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faPenToSquare}
                                    size="xs"
                                    title="Edit"
                                  />
                                </StyledGreenXButton>
                              ),
                            },
                            {
                              component: (
                                <StyledGreenXButton
                                  onClick={() =>
                                    handleRemoveRole(element, role)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faTrashCan}
                                    size="xs"
                                    title="Remove"
                                  />
                                </StyledGreenXButton>
                              ),
                            },
                          ]}
                        >
                          <p style={{ marginRight: "1em" }}>Role: {role.name}</p>
                        </XRowDetails>
                      ))}
                    </React.Fragment>
                  ) : (
                    <XRowDetails key={"XRowDetailsRoles"}></XRowDetails>
                  )}
                  {element.organizations &&
                  element.organizations.length > 0 ? (
                    <React.Fragment key={"XRowDetailsOrgs"}>
                      {element.organizations.map(
                        (organizations, organizationsIndex) => (
                          <XRowDetails
                            key={"XRowDetails" + organizationsIndex}
                            controlsDetails={[
                              {
                                component: (
                                  <StyledGreenXButton
                                    onClick={() =>
                                      handleEditOrganization(organizations)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faPenToSquare}
                                      size="xs"
                                      title="Edit"
                                    />
                                  </StyledGreenXButton>
                                ),
                              },
                              {
                                component: (
                                  <StyledGreenXButton
                                    onClick={() =>
                                      handleRemoveOrganization(element, organizations)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrashCan}
                                      size="xs"
                                      title="Remove"
                                    />
                                  </StyledGreenXButton>
                                ),
                              },
                            ]}
                          >
                            <p style={{ marginRight: "1em" }}>Organization: {organizations.name}</p>
                          </XRowDetails>
                        )
                      )}
                    </React.Fragment>
                  ) : (
                    <XRowDetails key={"XRowDetailsOrgs"}></XRowDetails>
                  )}

                  <XRowExtraDetails
                    key={"XRowExtraDetails"}
                    extraDetails={[
                      {
                        label: "Created at",
                        type: "date",
                        value: element.created_at,
                      },
                      {
                        label: "Updated at",
                        type: "date",
                        value: element.updated_at,
                      },
                    ]}
                  ></XRowExtraDetails>
                </XRow>
              ))) : 
              <p>Error</p>}
            </>
          )}
        </StyledActivitiesListContainer>
      </StyledGrid>
    </StyledFullCenter>
  ); 
}

export default Clients;