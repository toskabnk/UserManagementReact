import { XCard, XDropdown, XInput } from "@ximdex/xui-react/material"
import { StyledPageContainer, StyledPageMarginContainer } from "../styles/Containers"
import { StyledForm } from "../styles/FormStyles"
import LoadingButton from '@mui/lab/LoadingButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import { CenteredSpinner } from "../styles/Spinner";



const OrganizationForm = ({organization, setOrganization, selectedClient, setSelectedClient, clientsFixed, loading, handleSubmit, dataLoading=false, edit=false, isSuperAdmin=false}) => {
    
    const tooltip = <FontAwesomeIcon icon={faPenToSquare} size='1x' title={edit ? 'Edit Role' : 'Create Role'} />;

    const onInputChange = (e) => {
        setOrganization({
            ...organization,
            [e.target.id]: e.target.value
        });
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            {dataLoading ? (<CenteredSpinner top={"45%"} left={"45%"}/>)
                : (
                    <StyledPageContainer>
                        <h2>{edit ? 'Edit Organizatino Form' : 'Create Organization Form'}</h2>
                        <XCard title='Role data' isCollapsable={true} tooltip={tooltip}>
                            <StyledPageMarginContainer>
                                <XInput id='name' type="text" label="Organization name" value={organization.name} onChange={(e) => onInputChange(e)} required fullWidth sx={{mb: 4}}/>
                                <XInput id='description' type="text" label="Organization description" value={organization.description} onChange={(e) => onInputChange(e)} required fullWidth sx={{mb: 4}}/>
                            </StyledPageMarginContainer>
                        </XCard>
                        {isSuperAdmin ? (
                            <XCard title='Client' isCollapsable={true} tooltip={tooltip}>
                            <StyledPageMarginContainer>
                                <XDropdown options={clientsFixed} 
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(e, value) => setSelectedClient(value)}
                                    value={selectedClient}
                                    label='Clients'
                                    multiple={false}
                                    labelOptions='name'
                                    hasCheckBoxes={false}
                                    bgColor='100'
                                    renderOption={(option) => `${option.name}`}/>
                            </StyledPageMarginContainer>
                        </XCard>
                        ) : (null)}
                        <LoadingButton loading={loading} variant="contained" type="submit">
                            <span>{edit ? 'Edit Organization' : 'Create Organization'}</span>
                        </LoadingButton>
                    </StyledPageContainer>
            )}
        </StyledForm>
    )
}

export default OrganizationForm