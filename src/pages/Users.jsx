import React, { useState, useEffect } from 'react';
import userManagementApi from '../services/apiServices';
import { useAuth } from '../providers/AuthProvider/AuthContext';
import {XList, XSpinner, XContainerPage, XContainerSidebar, XContainerContent, XButton } from '@ximdex/xui-react/material'
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const CenteredSpinner = styled(XSpinner)`
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        position: absolute;
        transform: translate(-50%, -50%);
        top: 45%;
        left: 45%;
`;

const StyledMain = styled.main`
    display: grid;
    grid-template-columns: auto;

`;

function Users() { 
    const { isAuthenticated } = useAuth();
    const [loading, isLoading] = useState(true);
    const [data, setData] = useState(null);
    const token = useSelector((state) => state.user.access_token);

    const rows = [
        { id: 1, surname: 'Snow', name: 'Jon', birth_date: new Date('2023-11-03'), email: "john_snow@email.com"},
        { id: 2, surname: 'Lannister', name: 'Cersei', birth_date: new Date('2023-11-03'), email: "john_snow@email.com" },
        { id: 3, surname: 'Lannister', name: 'Jaime', birth_date: new Date('2023-11-03'), email: "john_snow@email.com" },
        { id: 4, surname: 'Stark', name: 'Arya', birth_date: new Date('2023-11-03'), email: "john_snow@email.com" },
        { id: 5, surname: 'Targaryen', name: 'Daenerys', birth_date: new Date('2023-11-03'), email: "john_snow@email.com" },
        { id: 6, surname: 'Melisandre', name: null, birth_date: new Date('2023-11-03'), email: "john_snow@email.com" },
        { id: 7, surname: 'Clifford', name: 'Ferrara', birth_date: new Date('2023-11-03'), email: "john_snow@email.com" },
        { id: 8, surname: 'Frances', name: 'Rossini', birth_date: new Date('2023-11-03'), email: "john_snow@email.com" },
        { id: 9, surname: 'Roxie', name: 'Harvey', birth_date: new Date('2023-11-03'), email: "john_snow@email.com" },
      ];
    
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'First name', width: 130 },
        { field: 'surname', headerName: 'Last name', width: 130 },
        { field: 'email', headerName: 'Email', width: 250 },
        {
          field: 'birth_date',
          headerName: 'Birth Date',
          width: 130,
        },
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.row.name || ''} ${params.row.surname || ''}`,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
              <button
                onClick={() => {
                  // Aquí puedes definir la lógica que deseas ejecutar cuando se hace clic en el botón
                  alert(`ID: ${params.row.id}, Name: ${params.row.name}`);
                }}
              >
                Click me
              </button>
            ),
          },
      ];

    useEffect(async () => {
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
        
    },[]);

    return (
        <>
            {loading ? <CenteredSpinner/> :
            <StyledMain>
            <XContainerPage navbarSize='unset' isScrollableY>
                <XContainerSidebar isCollapsable>
                    <XButton/>
                </XContainerSidebar>
                <XContainerContent>
                <DataGrid
                    rows={data ? data : rows}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
                </XContainerContent>
            </XContainerPage>
            </StyledMain>}
        </>
    ); 
} 
export default Users;
