import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faPlus, faParagraph, faAt} from "@fortawesome/free-solid-svg-icons";
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

function Users() { 
  const token = useSelector((state) => state.user.access_token);
  
  const [loading, isLoading] = useState(true);
  const [data, setData] = useState(null);
  const [radioValue, setRadioValue] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  
  const navigate = useNavigate();

  const options = [
      { value: 'name', label: 'Name', icon: <FontAwesomeIcon icon={faParagraph} />},
      { value: 'surname', label: 'Surname', icon: <FontAwesomeIcon icon={faParagraph} />},
      { value: 'email', label: 'Email', icon: <FontAwesomeIcon icon={faAt} />},
  ];

  //Borra un usuario
  const handleDeleteUser = (user) => {
    Swal.fire({
      title: 'Remove user',
      text: `Are you sure you want to delete the user ${user.name}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        userManagementApi.delete(`user/${user.id}`, {bearerToken: token})
        .then((response) => {
          getUsers();
          XPopUp({
            message: `User deleted`,
            iconType: "success",
            timer: "3000",
            popUpPosition: "top",
            iconColor: "ligthgreen",
          });
        }).catch((error) => {
          XPopUp({
            message:`Error deleting user`,
            iconType:'error',
            timer:'3000',
            popUpPosition:'top',
            iconColor: 'red',
          })
        })
      }
    })
  }

  //Dirige a la página de edición de usuario
  const handleEditUser = (user) => {
    navigate(`/editMember?id=${user.id}`)
  }

  //Elimina un rol del usuario
  const handleRemoveRole = (user, role) => {
    Swal.fire({
      title: 'Remove role',
      text: `Are you sure you want to remove the role ${role.name} from the ${user.name}?`,
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
          getUsers();
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

  //Dirige a la página de edición del rol
  const handleEditRole = (role) => {
    navigate(`/editRole?id=${role.id}`)
  }

  //Elimina una organización del usuario
  const handleRemoveOrganization = (user, organization) => {
    Swal.fire({
      title: 'Remove organization',
      text: `Are you sure you want to remove the organization ${organization.name} from the ${user.name}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        userManagementApi.delete(`member/${user.id}/organization/${organization.id}`, {bearerToken: token})
        .then((response) => {
          getUsers();
          XPopUp({
            message: `Organization removed from client`,
            iconType: "success",
            timer: "3000",
            popUpPosition: "top",
            iconColor: "ligthgreen",
          });
        }).catch((error) => {
          XPopUp({
            message:`Error removing organization from the user`,
            iconType:'error',
            timer:'3000',
            popUpPosition:'top',
            iconColor: 'red',
          })
        })
      }
    })
  }

  //Dirige a la página de edición de la organización
  const handleEditOrganization = (organization) => {
    navigate(`/editOrganization?id=${organization.id}`)
  }

  //Obtiene los usuarios
  const getUsers = async () => {
    async function fecthData() {
      isLoading(true);
      await userManagementApi.get("member", { bearerToken: token })
        .then((response) => {
          setData(response.data.data.members);
        })
        .catch((error) => {
          XPopUp({
            message:`Error loading users`,
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

  //Busca un usuario
  const search = async () => {
    async function fecthData() {
      isLoading(true);
      await userManagementApi.get(`member?${radioValue}=${searchValue}`, { bearerToken: token })
        .then((response) => {
          setData(response.data.data.members);
        })
        .catch((error) => {
          XPopUp({
            message:`Error loading users`,
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

  //Al cargar la pagina, ejecuta la función getUsers
  useEffect(() => {
      getUsers();
  },[]);

  return (
    <StyledFullCenter>
      <StyledGrid>
        <StyledSearchContainer>
          <StyledFilterXCard
            isCollapsable={true}
            isCollapsed={false}
            title="Search by"
          >
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
            <Chip label={`${data ? data.length : "0"} users`} />
            <StyledLink to={'/createMember'}>
              <XButton>
                <StyledFontAwesomeIcon
                  icon={faPlus}
                  title="Create a new user."
                  size="1x"
                  hasMarginRight={true}
                />
                New user
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
                  functionButtonCollapsable={() => {console.log('test')}}
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
                          onClick={() => handleEditUser(element)}
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            size="1x"
                            title="Edit user"
                          />
                        </StyledGreenXButton>
                      ),
                    },
                    {
                      component: (
                        <StyledRedXButton
                          key={"card_control" + index}
                          onClick={() => handleDeleteUser(element)}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            size="1x"
                            title="Remove user"
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
                      Surname: {element.surname}
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

export default Users;