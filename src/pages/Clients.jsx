import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCoffee, faTrashCan, faPlus} from "@fortawesome/free-solid-svg-icons";
import { StyledGreenXButton, StyledRedXButton, } from '@ximdex/xui-react/material/XRow/StyledXRow.js';
import { XRow, XRowDetails, XRowExtraDetails, XRowContent, XButton, XRadio, XInput, XPopUp} from '@ximdex/xui-react/material';
import { useAuth } from "../providers/AuthProvider/AuthContext";
import { useSelector } from "react-redux";
import userManagementApi from "../services/apiServices";
import { StyledActivitiesListContainer, StyledDivFlexBetween, StyledDivFlexStartWrap, StyledFilterXCard, StyledFullCenter, StyledGrid, StyledSearchContainer } from "../styles/Containers";
import { StyledLink } from "../styles/StyledLink";
import { StyledFontAwesomeIcon } from "../styles/Icons";
import { Chip } from "@mui/material";
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";
import { CenteredSpinner } from "../styles/Spinner";

function Clients() { 
  const { isAuthenticated } = useAuth();
  const [loading, isLoading] = useState(true);
  const [data, setData] = useState(null);
  const token = useSelector((state) => state.user.access_token);
  const navigate = useNavigate();

  const options = [
      { value: 'value1', label: 'label1', icon: <FontAwesomeIcon icon={faCoffee} />},
      { value: 'value2', label: 'label2', icon: <FontAwesomeIcon icon={faCoffee} />},
  ];

  const handleDeleteClient = (id) => {
    if(window.confirm(`Are you sure you want to delete the client with id ${id}?`)){
      userManagementApi.delete(`client/${id}`, {bearerToken: token})
        .then((response) => {
          console.log(response)
          getClients();
          XPopUp({
            message: `Client deleted`,
            iconType: "success",
            timer: "3000",
            popUpPosition: "top",
            iconColor: "ligthgreen",
          });
        }).catch((error) => {
          console.log(error)
          XPopUp({
            message:`Error deleting client`,
            iconType:'error',
            timer:'3000',
            popUpPosition:'top',
            iconColor: 'red',
          })
      })
    }
  }

  const handleEditClient = (client) => {
    navigate(`/editClient?id=${client.id}`)
  }

  const handleRemoveRole = (client, role) => {
    if(window.confirm(`Are you sure you want to remove the role ${role.name} from the ${client.name}?`)){
      userManagementApi.delete(`client/${client.id}/role/${role.id}`, {bearerToken: token})
      .then((response) => {
        console.log(response)
        getClients();
        XPopUp({
          message: `Role removed`,
          iconType: "success",
          timer: "3000",
          popUpPosition: "top",
          iconColor: "ligthgreen",
        });
      }).catch((error) => {
        console.log(error)
        XPopUp({
          message:`Error removing role from the client`,
          iconType:'error',
          timer:'3000',
          popUpPosition:'top',
          iconColor: 'red',
        })
      })
    }
  }

  const handleEditRole = (role) => {
    navigate(`/editRole?id=${role.id}`)
  }

  const handleRemoveOrganization = (client, organization) => {
    if(window.confirm(`Are you sure you want to remove the organization ${organization.name} from the ${client.name}?`)){
      userManagementApi.delete(`client/${client.id}/organization/${organization.id}`, {bearerToken: token})
      .then((response) => {
        console.log(response)
        getClients();
        XPopUp({
          message: `Organization removed`,
          iconType: "success",
          timer: "3000",
          popUpPosition: "top",
          iconColor: "ligthgreen",
        });
      }).catch((error) => {
        console.log(error)
        XPopUp({
          message:`Error removing organization from the client`,
          iconType:'error',
          timer:'3000',
          popUpPosition:'top',
          iconColor: 'red',
        })
      })
    }
  }

  const handleEditOrganization = (organization) => {
    navigate(`/editOrganization?id=${organization.id}`)
  }

  const getClients = async () => {
    async function fecthData() {
      isLoading(true);
      await userManagementApi
        .get("client", { bearerToken: token })
        .then((response) => {
          console.log(response);
          setData(response.data.data.clients);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          isLoading(false);
        });
    }
    fecthData();
  }

  useEffect(() => {
    getClients();
    console.log(`User isAuthenticaded ${isAuthenticated}`)
  },[]);
  
  /*
  Response example
  {
  "id": 3,
  "name": "Geo Beahan",
  "email": "amaya.oberbrunner@example.org",
  "email_verified_at": "2023-10-19T10:31:22.000000Z",
  "created_at": "2023-10-19T10:31:22.000000Z",
  "updated_at": "2023-10-19T10:31:22.000000Z",
  "surname": "Fadel",
  "birth_date": "1993-10-09",
  "roles": [
    {
      "id": 1,
      "name": "Admin",
      "created_at": "2023-10-19T10:31:22.000000Z",
      "updated_at": "2023-10-19T10:31:22.000000Z"
    }
  ],
  "organizations": [
    {
      "id": 1,
      "name": "XIMDEX",
      "description": "Modificado",
      "created_at": "2023-10-20T11:39:39.000000Z",
      "updated_at": "2023-10-20T11:48:52.000000Z"
    }
  ]
}
*/

  return (
    <StyledFullCenter>
      <StyledGrid>
        <StyledSearchContainer>
          <StyledFilterXCard
            isCollapsable={true}
            isCollapsed={false}
            title="Status"
          >
            <XRadio
              direction="column"
              value={"ALL"}
              onChange={(e) => {
                console.log(e);
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
              value={""}
              onChange={(e) => {
                console.log(e);
              }}
              onKeyDown={(e) => {
                console.log(e);
              }}
              type="search"
              size="small"
              style={{
                width: "-webkit-fill-available",
                margin: "0",
                background: "#FBFBFB",
              }}
              placeholder="Test search"
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
                  hasMarginRight={true}
                />
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
                          onClick={() => handleDeleteClient(element.id)}
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
                    <React.Fragment key={"XRowDetails"}>
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
                    <XRowDetails key={"XRowDetails"}></XRowDetails>
                  )}
                  {element.organizations &&
                  element.organizations.length > 0 ? (
                    <React.Fragment key={"XRowDetails"}>
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
                                      console.log(
                                        handleRemoveOrganization(element, organizations)
                                      )
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
                    <XRowDetails key={"XRowDetails"}></XRowDetails>
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