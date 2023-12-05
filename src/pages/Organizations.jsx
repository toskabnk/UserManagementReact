import React, { useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faParagraph, faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { StyledGreenXButton, StyledRedXButton, } from '@ximdex/xui-react/material/XRow/StyledXRow.js';
import { XSpinner, XRow, XRowDetails, XRowExtraDetails, XRowContent, XButton, XRadio, XInput, XPopUp} from '@ximdex/xui-react/material';
import styled from 'styled-components';
import { useSelector } from "react-redux";
import userManagementApi from "../services/apiServices";
import {useNavigate } from "react-router-dom";
import { StyledActivitiesListContainer, StyledDivFlexBetween, StyledDivFlexStartWrap, StyledFilterXCard, StyledGrid, StyledSearchContainer } from "../styles/Containers";
import { StyledFontAwesomeIcon } from "../styles/Icons";
import { Chip, CircularProgress } from "@mui/material";
import { StyledLink } from "../styles/StyledLink";
import Swal from "sweetalert2";

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
  const token = useSelector((state) => state.user.access_token);
  
  const [loading, isLoading] = useState(true);
  const [data, setData] = useState(null);
  const [radioValue, setRadioValue] = useState("name"); //Valor por defecto del filtro de busqueda
  const [searchValue, setSearchValue] = useState(""); //Valor del input de busqueda
  const [infoRows, setInfoRows] = useState([]);
  const [fetchingInfoRows, setFetchingInfoRows] = useState([])

  const navigate = useNavigate();

  //Carga los detalles de una organizacion
  const loadDetails = async (id, index) => {
    //Si no se han cargado los detalles de la organizacion, se cargan
    if(!infoRows[index]){
      let copy = [...fetchingInfoRows]
      copy[index] = true
      setFetchingInfoRows(copy)
      
      await userManagementApi.get(`organization/${id}`, {bearerToken: token})
      .then((response) => {
        let copy = [...infoRows];
        copy[index] = response.data.data.organization;
        setInfoRows(copy)
      })
      .catch((error) => {
        XPopUp({
          message: `Error loading organization details`,
          iconType: "error",
          timer: "3000",
          popUpPosition: "top",
          iconColor: "red",
        });
      }).finally(() => {
        let copy = [...fetchingInfoRows]
        copy[index] = false
        setFetchingInfoRows(copy)
      });
    }
  }

  //Cuando se actualiza el array de organizaciones, se actualiza el array de cargando detalles
  useEffect(() => {
    console.log(data)
    let load = []
      if(data){
        data.forEach((organizations) => {
          load.push(false)
      })
      setFetchingInfoRows(load)
    }
  },[data]);
    
  //Opciones del filtro de busqueda
  const options = [
      { value: 'name', label: 'Name', icon: <FontAwesomeIcon icon={faParagraph} />},
      { value: 'description', label: 'Description', icon: <FontAwesomeIcon icon={faParagraph} />},

  ];

  //Consigue las organizaciones
  const getOrganizations = async () => {
      async function fecthData() { 
        await userManagementApi.get('organization', {bearerToken: token})
        .then((response) => {
            setData(response.data.data.organizations);
        })
        .catch((error) => {
            XPopUp({
              message: `Error loading organizations`,
              iconType: "error",
              timer: "3000",
              popUpPosition: "top",
              iconColor: "red",
            });
        })
        .finally(() => {
          isLoading(false)
        })
      }
      fecthData();
  }

  //Elimina una organizacion
  const handleDelete = async (id) => {
    Swal.fire({
      title: `Are you sure you want to remove this organization?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        isLoading(true)
        await userManagementApi.delete(`organization/${id}`, {bearerToken: token})
        .then((response) => {
            getOrganizations();
            XPopUp({
              message: `Organization removed`,
              iconType: "success",
              timer: "3000",
              popUpPosition: "top",
              iconColor: "ligthgreen",
            });
        })
        .catch((error) => {
            XPopUp({
              message: `Error removing organization`,
              iconType: "error",
              timer: "3000",
              popUpPosition: "top",
              iconColor: "red",
            });
        })
      }
    })
  }

  //Elimina un usuario de una organizacion
  const handleRemoveUser = async (member, organization) => {
    Swal.fire({
      title: `Are you sure you want to remove ${member.name} from ${organization.name}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Remove`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#d33",
      denyButtonColor: "#43a1a2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        isLoading(true)
        await userManagementApi.delete(`member/${member.id}/organization/${organization.id}`, {bearerToken: token})
        .then((response) => {
          loadDetails(organization.id, organization.id)
          XPopUp({
            message: `Organization removed`,
            iconType: "success",
            timer: "3000",
            popUpPosition: "top",
            iconColor: "ligthgreen",
          });
        })
        .catch((error) => {
          XPopUp({
            message: `Error removing organization`,
            iconType: "error",
            timer: "3000",
            popUpPosition: "top",
            iconColor: "red",
          });
        })
        .finally(() => {
          isLoading(false)
        })
      }
    })
  }

  //Busca una organizacion
  const search = async () => {
    isLoading(true)
    await userManagementApi.get(`organization?${radioValue}=${searchValue}`, {bearerToken: token})
    .then((response) => {
      setData(response.data.data.organizations);
    })
    .catch((error) => {
      XPopUp({
        message: `Error searching organization`,
        iconType: "error",
        timer: "3000",
        popUpPosition: "top",
        iconColor: "red",
      });
    })
    .finally(() => {
      isLoading(false)
    })
  }

  //Carga las organizaciones al cargar la pagina
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
                          Members
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
                        Name: {element.name}
                      </p>
                      <p style={{ marginRight: "1em" }}>
                        ID: {element.id}
                      </p>
                    </XRowContent>
                    {fetchingInfoRows[index] ? (
                      <XRowDetails
                      key={"XRowDetails_loading"}
                      style={{justifyContent:'center'}}>
                        <CircularProgress color='primary' size={'50px'} style={{padding: '10px'}}/>
                      </XRowDetails> 
                    ) : (
                      <React.Fragment key={"XRowDetails"}>
                        {infoRows[index] && infoRows[index].members.map((member, memberIndex) => (
                          <XRowDetails
                          key={`XRowDetails_${memberIndex}`}
                          controlsDetails={[
                            {
                              component: (
                                <StyledGreenXButton
                                  onClick={() =>
                                    handleRemoveUser(member, element)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faTrashCan}
                                    size="xs"
                                    title="Remove user from organization"
                                  />
                                </StyledGreenXButton>
                              ),
                            },
                          ]}>
                            <p style={{ marginRight: "1em" }}>
                              {`${member.name} ${member.surname}`}
                            </p>
                          </XRowDetails>
                        ))}
                      </React.Fragment>
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