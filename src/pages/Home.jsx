import { Stack } from '@mui/system';
import { StyledSectionBorder } from '../styles/SectionStyles';
import { StyledP } from '../styles/ErrorMessagesStyles';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider/AuthContext';

function Home() { 

    const { isAdmin, isSuperAdmin } = useAuth();
    const navigate = useNavigate();

    return ( 
        <StyledSectionBorder>
            <StyledP>Index</StyledP>
            <Stack spacing={2} direction="column">
                {isAdmin || isSuperAdmin ? (
                <>
                    <Button style={{margin: '10px'}} variant="contained" color="primary" onClick={() => {navigate('/users')}}>Manage Users</Button>
                    {isSuperAdmin ? (
                        <Button style={{margin: '10px'}} variant="contained" color="primary" onClick={() => {navigate('/clients')}}>Manage Client</Button>
                    ) : (null)}
                    <Button style={{margin: '10px'}} variant="contained" color="primary" onClick={() => {navigate('/roles')}}>Manage Roles</Button>
                    <Button style={{margin: '10px'}} variant="contained" color="primary" onClick={() => {navigate('/organizations')}}>Manage Organizations</Button>
                </>
                ) : ( null )}
                <Button style={{margin: '10px'}} variant="contained" color="primary" onClick={() => {navigate('/user')}}>My Profile</Button>
            </Stack>
        </StyledSectionBorder>
    ); 
} 
export default Home; 