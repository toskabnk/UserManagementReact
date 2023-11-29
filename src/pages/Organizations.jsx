import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCoffee, faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { StyledGreenXButton, StyledRedXButton, } from '@ximdex/xui-react/material/XRow/StyledXRow.js';
import { XSpinner, XRow, XRowDetails, XRowExtraDetails, XRowContent, XButton, XRadio, XInput} from '@ximdex/xui-react/material';
import styled from 'styled-components';
import { useAuth } from "../providers/AuthProvider/AuthContext";
import { useSelector } from "react-redux";
import userManagementApi from "../services/apiServices";
import {useNavigate } from "react-router-dom";
import { StyledActivitiesListContainer, StyledDivFlexBetween, StyledDivFlexStartWrap, StyledFilterXCard, StyledGrid, StyledSearchContainer } from "../styles/Containers";
import { StyledFontAwesomeIcon } from "../styles/Icons";
import { Chip } from "@mui/material";
import Divider from '@mui/material/Divider';
import { StyledLink } from "../styles/StyledLink";

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
  const [infoRows, setInfoRows] = useState([]);
  
  const navigate = useNavigate();

  const loadDetails = async (id, position) => {
    await userManagementApi.get(`organization/${id}`, {bearerToken: token})
    .then((response) => {
        let copy = infoRows;
        copy[position] = response.data.data.organization;
        setInfoRows(copy)
    })
    .catch((error) => {
        console.log(error)
    })

    console.log(infoRows)
  }
  
  useEffect(() => {
    console.log(infoRows)
  },[infoRows]);
    
    
    const options = [
        { value: 'value1', label: 'label1', icon: <FontAwesomeIcon icon={faCoffee} />},
        { value: 'value2', label: 'label2', icon: <FontAwesomeIcon icon={faCoffee} />},
    ];

    const getOrganizations = async () => {
        async function fecthData() {
          await userManagementApi.get('organization', {bearerToken: token})
          .then((response) => {
              console.log(response)
              setData(response.data.data.organizations);
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

    const handleDelete = async (id) => {
      await userManagementApi.delete(`organization/${id}`, {bearerToken: token})
      .then((response) => {
          console.log(response)
          getOrganizations();
      })
      .catch((error) => {
          console.log(error)
      })
    }

    useEffect(() => {
        getOrganizations();
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
              <Chip label={`${data ? data.length : "0"} organizations`} />
              <StyledLink to={'/createOrganization'}>
                <XButton>
                  <StyledFontAwesomeIcon
                    icon={faPlus}
                    title="Create a new organization"
                    size="1x"
                    hasMarginRight={true}
                  />
                  New organization
                </XButton>
              </StyledLink>
            </StyledDivFlexBetween>
            {loading ? (
              <CenteredSpinner />
            ) : (
              <>
                {data ? data.map((element, index) => (
                  <XRow
                    name={`${element.name}${element.id}`}
                    key={index}
                    identifier={element.id}
                    isCollapsable={true}
                    functionButtonCollapsable={() => loadDetails(element.id, index)}
                    labelButtonCollapsable={
                      <>
                        <p style={{ marginRight: "1em" }}>
                          Details
                        </p>
                      </>
                    }
                    controls={[
                      {
                        component: (
                          <StyledGreenXButton
                            key={"card_control" + index}
                            onClick={() => navigate(`/editOrganization?id=${element.id}`)}
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              size="1x"
                              title="Edit organization"
                            />
                          </StyledGreenXButton>
                        ),
                      },
                      {
                        component: (
                          <StyledRedXButton
                            key={"card_control" + index}
                            onClick={() => handleDelete(element.id)}
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
                        Orgnanization: {element.name}
                      </p>
                      <p style={{ marginRight: "1em" }}>
                        ID: {element.id}
                      </p>
                    </XRowContent>
                    {/* <div className='detail-rows-container'> */}
                    <XRowDetails key="XRowDetails">
                      <>
                        {infoRows[index] !== undefined ? (<p>Algo</p>):(<p>Loading...</p>)}
                      </>
                    </XRowDetails>
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
                )) 
                : 
                <p>Error</p>}
              </>
            )}
          </StyledActivitiesListContainer>
        </StyledGrid>
      </StyledFullCenter>
    ); 
} 
export default Organizations; 