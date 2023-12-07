import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faParagraph, faTrashCan, faPlus} from "@fortawesome/free-solid-svg-icons";
import { StyledGreenXButton, StyledRedXButton, } from '@ximdex/xui-react/material/XRow/StyledXRow.js';
import { XRow, XRowDetails, XRowExtraDetails, XRowContent, XButton, XRadio, XInput, XPopUp} from '@ximdex/xui-react/material';
import { useAuth } from "../providers/AuthProvider/AuthContext";
import { useSelector } from "react-redux";
import userManagementApi from "../services/apiServices";
import { StyledActivitiesListContainer, StyledDivCenterY, StyledDivFlexBetween, StyledDivFlexStartWrap, StyledFilterXCard, StyledFullCenter, StyledGrid, StyledSearchContainer, StyledUserId } from "../styles/Containers";
import { StyledLink } from "../styles/StyledLink";
import { StyledFontAwesomeIcon } from "../styles/Icons";
import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CenteredSpinner } from "../styles/Spinner";
import Swal from "sweetalert2";

function Roles() {
  const { isSuperAdmin } = useAuth();
  const token = useSelector((state) => state.user.access_token);

  const [loading, isLoading] = useState(true);
  const [data, setData] = useState(null);
  const [radioValue, setRadioValue] = useState("name"); //Valor por defecto del filtro
  const [searchValue, setSearchValue] = useState(""); //Valor del input de busqueda

  const navigate = useNavigate();
  
  //Opciones del filtro
  const options = [
      { value: 'name', label: 'Name', icon: <FontAwesomeIcon icon={faParagraph} />},
      { value: 'memberName', label: 'Member name', icon: <FontAwesomeIcon icon={faParagraph} />},
  ];

  //Elimina un rol
  const handleDeleteRole = (role) => {
    Swal.fire({
      title: 'Delete role',
      text: `Are you sure you want to delete the role ${role.name}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        userManagementApi.delete(`role/${role.id}`, {bearerToken: token})
          .then((response) => {
            getRoles();
            XPopUp({
              message: `Role deleted`,
              iconType: "success",
              timer: "3000",
              popUpPosition: "top",
              iconColor: "ligthgreen",
            });
          }).catch((error) => {
            XPopUp({
              message:`Error deleting role`,
              iconType:'error',
              timer:'3000',
              popUpPosition:'top',
              iconColor: 'red',
            })
        })
      }
    })
  }

  //Redirige a la pagina de edicion de un client
  const handleEditClient = (user) => {
    navigate(`/editClient?id=${user.id}`)
  }

  //Redirige a la pagina de edicion de un member
  const handleEditMember = (user) => {
    navigate(`/editMember?id=${user.id}`)
  }

  //Redirige a la pagina de edicion de un rol
  const handleEditRole = (role) => {
      navigate(`/editRole?id=${role.id}`)
  }

  //Elimina un usuario de un rol
  const handleRemoveUser = (user, role) => {
    Swal.fire({
      title: 'Remove role',
      text: `Are you sure you want to remove the role ${role.name} from ${user.name}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        userManagementApi.delete(`member/${user.id}/role/${role.id}`, {bearerToken: token})
        .then((response) => {
          getRoles();
          XPopUp({
            message: `Role removed`,
            iconType: "success",
            timer: "3000",
            popUpPosition: "top",
            iconColor: "ligthgreen",
          });
        }).catch((error) => {
          XPopUp({
            message:`Error removing role from the user`,
            iconType:'error',
            timer:'3000',
            popUpPosition:'top',
            iconColor: 'red',
          })
        })
      }
    })
  }

  //Elimina un cliente de un rol
  const handleRemoveClient = (user, role) => {
    Swal.fire({
      title: 'Remove role',
      text: `Are you sure you want to remove the role ${role.name} from ${user.name}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        userManagementApi.delete(`client/${user.id}/role/${role.id}`, {bearerToken: token})
        .then((response) => {
          getRoles();
          XPopUp({
            message: `Role removed`,
            iconType: "success",
            timer: "3000",
            popUpPosition: "top",
            iconColor: "ligthgreen",
          });
        }).catch((error) => {
          XPopUp({
            message:`Error removing role from the user`,
            iconType:'error',
            timer:'3000',
            popUpPosition:'top',
            iconColor: 'red',
          })
        })
      }
    })
  }

  //Obtiene todos los roles
  const getRoles = async () => {
      async function fecthData() {
        isLoading(true);
        await userManagementApi
          .get("role", { bearerToken: token })
          .then((response) => {
            setData(response.data.data.roles);
          })
          .catch((error) => {
            XPopUp({
              message:`Error getting roles`,
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

  //Busca un rol
  const search = async () => {
      async function fecthData() {
        isLoading(true);
        await userManagementApi
          .get(`role?${radioValue}=${searchValue}`, { bearerToken: token })
          .then((response) => {
            setData(response.data.data.roles);
          })
          .catch((error) => {
            XPopUp({
              message:`Error searching role`,
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

  //Carga los roles al cargar la pagina
  useEffect(() => {
      getRoles();
    },[]);
    
  return ( 
      <StyledFullCenter>
    <StyledGrid>
      <StyledSearchContainer>
        <StyledFilterXCard
          isCollapsable={true}
          isCollapsed={false}
          title="Search by">
          <XRadio
            direction="column"
            value={radioValue}
            onChange={(e) => {
              setRadioValue(e.target.value);
            }}
            options={options}
            paddingXSize="s"
            style={{ paddingBottom: "0.5em" }}/>
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
          <Chip label={`${data ? data.length : "0"} roles`} />
          <StyledLink to={'/createRole'}>
            <XButton>
              <StyledFontAwesomeIcon
                icon={faPlus}
                title="Create a new role."
                size="1x"
                hasMarginRight={true}
              />
              New role
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
                    {element.members.length} members have this role {isSuperAdmin ? `| ${element.clients.length} clients have this role` : ''}
                    </p>
                  </>
                }
                controls={[
                  {
                    component: (
                      <StyledGreenXButton
                        key={"card_control" + index}
                        onClick={() => handleEditRole(element)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          size="1x"
                          title="Edit role"
                        />
                      </StyledGreenXButton>
                    ),
                  },
                  {
                    component: (
                      <StyledRedXButton
                        key={"card_control" + index}
                        onClick={() => handleDeleteRole(element)}
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          size="1x"
                          title="Remove role"
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
                </XRowContent>
                {/* <div className='detail-rows-container'> */}
                {element.members && element.members.length > 0 ? (
                  <React.Fragment key={"XRowDetails"}>
                    {element.members.map((user, userIndex) => (
                      <XRowDetails
                        key={"XRowDetails" + userIndex}
                        controlsDetails={[
                          {
                            component: (
                              <StyledGreenXButton
                                onClick={() =>
                                  handleEditMember(user)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  size="xs"
                                  title="Edit user"
                                />
                              </StyledGreenXButton>
                            ),
                          },
                          {
                            component: (
                              <StyledGreenXButton
                                onClick={() =>
                                  handleRemoveUser(user, element)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  size="xs"
                                  title="Remove role from user"
                                />
                              </StyledGreenXButton>
                            ),
                          },
                        ]}
                      >
                          <StyledDivCenterY>
                          <StyledUserId>ID: {user.id}</StyledUserId>
                          <p style={{ marginRight: "1em" }}>Member: {user.name} {user.surname}</p>
                          </StyledDivCenterY>
                      </XRowDetails>
                    ))}
                  </React.Fragment>
                ) : (
                  <XRowDetails key={"XRowDetails"}></XRowDetails>
                )}
                {isSuperAdmin && element.clients && element.clients.length > 0 ? (
                  <React.Fragment key={"XRowDetails"}>
                    {element.clients.map((user, userIndex) => (
                      <XRowDetails
                        key={"XRowDetails" + userIndex}
                        controlsDetails={[
                          {
                            component: (
                              <StyledGreenXButton
                                onClick={() =>
                                  handleEditClient(user)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  size="xs"
                                  title="Edit client"
                                />
                              </StyledGreenXButton>
                            ),
                          },
                          {
                            component: (
                              <StyledGreenXButton
                                onClick={() =>
                                  handleRemoveClient(user, element)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  size="xs"
                                  title="Remove role from client"
                                />
                              </StyledGreenXButton>
                            ),
                          },
                        ]}
                      >
                          <StyledDivCenterY>
                          <StyledUserId>ID: {user.id}</StyledUserId>
                          <p style={{ marginRight: "1em" }}>Client: {user.name}</p>
                          </StyledDivCenterY>
                      </XRowDetails>
                    ))}
                  </React.Fragment>
                ) : (
                  <XRowDetails key={"XRowDetails"}></XRowDetails>
                )}
                {/* XRow Details */}
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
export default Roles; 