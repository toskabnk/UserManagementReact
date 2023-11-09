import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCoffee, faTrashCan, faPlus} from "@fortawesome/free-solid-svg-icons";
import { StyledGreenXButton, StyledRedXButton, } from '@ximdex/xui-react/material/XRow/StyledXRow.js';
import { XSpinner, XRow, XRowDetails, XRowExtraDetails, XRowContent, XButton, XRadio, XInput} from '@ximdex/xui-react/material';
import styled from 'styled-components';
import { useAuth } from "../providers/AuthProvider/AuthContext";
import { useSelector } from "react-redux";
import userManagementApi from "../services/apiServices";
import { StyledActivitiesListContainer, StyledDivFlexBetween, StyledDivFlexStartWrap, StyledFilterXCard, StyledGrid, StyledSearchContainer } from "../styles/Containers";
import { StyledFontAwesomeIcon } from "../styles/Icons";
import { Chip } from "@mui/material";
import Divider from '@mui/material/Divider';

const CenteredSpinner = styled(XSpinner)`
        width: 100px;
        height: 100px;
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 60%;
`;

export const StyledFullCenter = styled('div')`
  width: 100%;
  background-color: #eeeeee;
`;

function Organizations() { 
    const { isAuthenticated } = useAuth();
    const [loading, isLoading] = useState(true);
    const [data, setData] = useState(null);
    const token = useSelector((state) => state.user.access_token);

    const options = [
        { value: 'value1', label: 'label1', icon: <FontAwesomeIcon icon={faCoffee} />},
        { value: 'value2', label: 'label2', icon: <FontAwesomeIcon icon={faCoffee} />},
    ];

    const getUsers = async () => {
        async function fecthData() {
          await userManagementApi.get('user', {bearerToken: token})
          .then((response) => {
              console.log(response)
              setData(response.data.data.user);
              isLoading(false);
          })
          .catch((error) => {
              console.log(error)
              isLoading(false)
          })
          .finally(() => {
          })
        }
        fecthData();
    }

    useEffect(() => {
        getUsers();
      },[]);


    /*
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
              <Chip label={`${data ? data.length : "0"} users`} />
              <XButton>
                <StyledFontAwesomeIcon
                  icon={faPlus}
                  title="Create a new user."
                  size="1x"
                  hasMarginRight={true}
                />
                New user
              </XButton>
            </StyledDivFlexBetween>
            {loading ? (
              <CenteredSpinner />
            ) : (
              <>
                {data.map((element, index) => (
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
                            onClick={() => console.log("EDITAR", index)}
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              size="1x"
                              title="Edit assesment"
                            />
                          </StyledGreenXButton>
                        ),
                      },
                      {
                        component: (
                          <StyledRedXButton
                            key={"card_control" + index}
                            onClick={() => console.log("ELIMINAR", index)}
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              size="1x"
                              title="Eliminar assesment"
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
                        Surname: {element.surname} Email: {element.email}
                      </p>
                      <p style={{ marginRight: "1em" }}>
                        Email: {element.email}
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
                                      console.log("EDITAR DETAILS", roleIndex)
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
                                      console.log("EDITAR DETAILS", roleIndex)
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
                            ]}
                          >
                            <p style={{ marginRight: "1em" }}>{role.name}</p>
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
                                        console.log(
                                          "EDITAR DETAILS",
                                          organizationsIndex
                                        )
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
                                          "EDITAR DETAILS",
                                          organizationsIndex
                                        )
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
                              ]}
                            >
                              <p style={{ marginRight: "1em" }}>
                                {organizations.name}
                              </p>
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
                ))}
              </>
            )}
          </StyledActivitiesListContainer>
        </StyledGrid>
      </StyledFullCenter>
    ); 
} 
export default Organizations; 