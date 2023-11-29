import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCoffee, faTrashCan, faPlus} from "@fortawesome/free-solid-svg-icons";
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

function Roles() { 
    const { isAuthenticated, isSuperAdmin } = useAuth();
    const [loading, isLoading] = useState(true);
    const [data, setData] = useState(null);
    const token = useSelector((state) => state.user.access_token);

    const navigate = useNavigate();
    
    const options = [
        { value: 'value1', label: 'label1', icon: <FontAwesomeIcon icon={faCoffee} />},
        { value: 'value2', label: 'label2', icon: <FontAwesomeIcon icon={faCoffee} />},
    ];

    const handleDeleteRole = (id) => {
        if(window.confirm(`Are you sure you want to delete the role with id ${id}?`)){
          userManagementApi.delete(`role/${id}`, {bearerToken: token})
          .then((response) => {
            console.log(response)
            getRoles();
            XPopUp({
              message: `Role deleted`,
              iconType: "success",
              timer: "3000",
              popUpPosition: "top",
              iconColor: "ligthgreen",
            });
          }).catch((error) => {
            console.log(error)
            XPopUp({
              message:`Error deleting role`,
              iconType:'error',
              timer:'3000',
              popUpPosition:'top',
              iconColor: 'red',
            })
        })
      }
    }

    const handleEditClient = (user) => {
        navigate(`/editClient?id=${user.id}`)
    }

    const handleEditMember = (user) => {
      navigate(`/editMember?id=${user.id}`)
  }

    const handleEditRole = (role) => {
        navigate(`/editRole?id=${role.id}`)
    }

    const handleRemoveUser = (user, role) => {
        if(window.confirm(`Are you sure you want to remove the role ${role.name} from ${user.name}?`)){
          userManagementApi.delete(`user/${user.id}/role/${role.id}`, {bearerToken: token})
          .then((response) => {
            console.log(response)
            getRoles();
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
              message:`Error removing role from the user`,
              iconType:'error',
              timer:'3000',
              popUpPosition:'top',
              iconColor: 'red',
            })
          })
        }
    }

    const getRoles = async () => {
        async function fecthData() {
          isLoading(true);
          await userManagementApi
            .get("role", { bearerToken: token })
            .then((response) => {
              console.log(response);
              setData(response.data.data.roles);
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
        getRoles();
        console.log(`User isAuthenticaded ${isAuthenticated}`)
      },[]);
    
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
                          onClick={() => handleDeleteRole(element.id)}
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