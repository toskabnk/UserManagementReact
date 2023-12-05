import { StyledPageContainer, StyledPageMarginContainer } from "../styles/Containers";
import { XCard, XDropdown, XInput } from '@ximdex/xui-react/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { StyledForm } from '../styles/FormStyles';
import { CenteredSpinner } from "../styles/Spinner";


const RoleForm = ({role, setRole, selectedMembers, setSelectedMembers, membersFixed, selectedClients, setSelectedClients, clientsFixed, loading, handleSubmit, dataLoading=false, edit=false, superAdmin=false}) => {

    const tooltip = <FontAwesomeIcon icon={faPenToSquare} size='1x' title={edit ? 'Edit Role' : 'Create Role'} />;

    const onInputChange = (e) => {
        setRole({
            ...role,
            [e.target.id]: e.target.value
        });
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            {dataLoading ? (<CenteredSpinner top={"45%"} left={"45%"}/>)
                : (
                    <StyledPageContainer>
                        <h2>{edit ? 'Edit Role Form' : 'Create Role Form'}</h2>
                        <XCard title='Role data' isCollapsable={true} tooltip={tooltip}>
                            <StyledPageMarginContainer>
                                <XInput id='name' type="text" label="Role Name" value={role.name} onChange={(e) => onInputChange(e)} required fullWidth sx={{mb: 4}}/>
                            </StyledPageMarginContainer>
                        </XCard>
                        {superAdmin ? 
                        <>
                            <XCard title='Members' isCollapsable={true} tooltip={tooltip}>
                                <StyledPageMarginContainer>
                                    <XDropdown options={membersFixed} 
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onChange={(e, values) => setSelectedMembers(values)}
                                        multiple
                                        value={selectedMembers}
                                        label='Members'
                                        labelOptions='email'
                                        bgColor='100'
                                        renderOption={(option) => `${option.name} ${option.surname}`}/>
                                </StyledPageMarginContainer>
                            </XCard>
                            <XCard title='Clients' isCollapsable={true} tooltip={tooltip}>
                                <StyledPageMarginContainer>
                                    <XDropdown options={clientsFixed} 
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onChange={(e, values) => setSelectedClients(values)}
                                        multiple
                                        value={selectedClients}
                                        label='Clients'
                                        labelOptions='name'
                                        bgColor='100'
                                        renderOption={(option) => `${option.name}`}/>
                                </StyledPageMarginContainer>
                            </XCard>
                        </> : null}
                        <LoadingButton loading={loading} variant="contained" type="submit">
                            <span>{edit ? 'Edit Role' : 'Create Role'}</span>
                        </LoadingButton>
                    </StyledPageContainer>
            )}
        </StyledForm>
    )
}

export default RoleForm;