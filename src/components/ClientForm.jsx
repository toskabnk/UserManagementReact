import { StyledPageContainer, StyledPageMarginContainer } from "../styles/Containers";
import { XCard, XDropdown, XInput } from '@ximdex/xui-react/material';
import { Button, Stack} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import { StyledForm } from '../styles/FormStyles';
import { CenteredSpinner } from "../styles/Spinner";
import { useNavigate } from "react-router-dom";


const ClientForm = ({client, setClient, selectedRoles, setSelectedRoles, rolesFixed, loading, handleSubmit, dataLoading=false, edit=false, isDisabled=false}) => {
    
    const navigate = useNavigate();

    const onInputChange = (e) => {
        setClient({
            ...client,
            [e.target.id]: e.target.value
        });
    }

    const {name, email, password, password2, organization_name, organization_description} = client;

    const tooltip = <FontAwesomeIcon icon={faPenToSquare} size='1x' title={edit ? 'Edit Client' : 'Create Client'} />;

    return (
        <StyledForm onSubmit={handleSubmit}>
                
                {dataLoading ? (<CenteredSpinner top={"45%"} left={"45%"}/>)
                 : (
                    <StyledPageContainer>
                    <h2>{edit ? 'Edit Client Form' : 'Create Client Form'}</h2>
                    <XCard title='Client data'  tooltip={tooltip}>
                    <StyledPageMarginContainer>
                        <XInput id='name' type="text" label="Name" value={name} onChange={(e) => onInputChange(e)} fullWidth required/>
                        <XInput id='email' type="email" label="Email" value={email} onChange={(e) => onInputChange(e)} fullWidth required/>
                        <XInput id='password'  type="password" label="Password" value={password} onChange={(e) => onInputChange(e)} required={!edit} fullWidth/>
                        {edit ? null : (
                            <XInput id='password2' type="password" label="Repeat password" value={password2} onChange={(e) => onInputChange(e)} required fullWidth/>
                        )}
                    </StyledPageMarginContainer>
                    </XCard>
                    {edit ? null : ( 
                        <XCard title='Client Organization Data (Optional)' tooltip={tooltip}>
                            <StyledPageMarginContainer>
                                <Stack spacing={3}  direction="column" justifyContent="flex-start" alignItems="center" sx={{marginBottom: 4}}>
                                    <XInput id='organization_name' type="text" label="Organization name" value={organization_name} onChange={(e) => onInputChange(e)} fullWidth/>
                                    <XInput id='organization_description' type="text" multiline label="Organization Description" value={organization_description} onChange={(e) => onInputChange(e)} fullWidth/>
                                </Stack>
                            </StyledPageMarginContainer>
                        </XCard>
                    )}
                    <XCard title='Existing Roles' tooltip={tooltip}>
                        <StyledPageMarginContainer>
                            <Stack spacing={3}  direction="column" justifyContent="flex-start" alignItems="center" sx={{marginBottom: 4}}>
                                <XDropdown options={rolesFixed} 
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(e, values) => setSelectedRoles(values)}
                                    multiple 
                                    value={selectedRoles}
                                    label='Roles'
                                    labelOptions='name'
                                    bgColor='100'
                                    renderOption={(option) => option.name}/>
                                {/*
                                <Select labelId="multiple-org-label" id="multiple-org" multiple value={selectedOrgs.map(org => org.name)} label="Organizations" onChange={handleChangeOrg} input={<OutlinedInput label="Roles" />} renderValue={(selected) => selected.join(', ')} MenuProps={MenuProps}>
                                    {orgFixed.map((organization) => (
                                        <MenuItem key={organization.id} value={organization.id}>
                                        <Checkbox checked={selectedOrgs.some(org => org.id === organization.id)} />
                                        <ListItemText primary={organization.name} />
                                    </MenuItem>
                                    ))}
                                </Select> */}
                            </Stack>
                        </StyledPageMarginContainer>
                    </XCard>
                    <LoadingButton disabled={isDisabled} loading={loading} variant="contained" type="submit">
                        <span>{edit ? 'Edit Client' : 'Create Client'}</span>
                    </LoadingButton>
                    <Button style={{float: 'right'}} variant="contained" onClick={() => {navigate(-1)}}>Back</Button>
                    </StyledPageContainer>
                 )}
            </StyledForm>
    )
}

export default ClientForm