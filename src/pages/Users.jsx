import React, { useState, useEffect } from 'react';
import userManagementApi from '../services/apiServices';
import { useAuth } from '../providers/AuthProvider/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Users() { 
    const { accessToken } = useAuth();
    const [loading, isLoading] = useState(true);

    useEffect(async () => {
        await userManagementApi.get('organization', {bearerToken: accessToken})
        .then((response) => {
            console.log(response)
            isLoading(false);
        })
        .catch((error) => {
            console.log(error)
        })
        
    },[]);

    return ( 
        <div> 
            {loading ? <LoadingSpinner /> : <p>Cargado!</p>}
        </div> 
    ); 
} 
export default Users; 