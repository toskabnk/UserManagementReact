import { StyledPageContainer, StyledPageMarginContainer } from "../styles/Containers";
import { XCard, XDropdown, XInput } from '@ximdex/xui-react/material';
import { Stack} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import { StyledForm } from '../styles/FormStyles';
import { CenteredSpinner } from "../styles/Spinner";


const ClientForm = ({client, setClient, selectedRoles, setSelectedRoles, rolesFixed, loading, handleSubmit, dataLoading=false, edit=false, isDisabled=false}) => {
    
    const onInputChange = (e) => {
        setClient({
            ...client,
            [e.target.id]: e.target.value
        });
    }

    const handleChangeOrg = (event) => {
        const { value } = event.target;
        let updatedSelectedOrgs = [...selectedOrgs];
        const index = selectedOrgs.find(org => org.id == value[value.length - 1]);
        if (!index) {
            const orgToAdd = orgFixed.find(org => org.id == value[value.length - 1]);
            if (orgToAdd) {
                updatedSelectedOrgs.push(orgToAdd);
                setSelectedOrgs(updatedSelectedOrgs);
            }
        } else {
            let toDelete = updatedSelectedOrgs.findIndex(org => org.id == value[value.length - 1])
            updatedSelectedOrgs.splice(toDelete, 1);
            setSelectedOrgs(updatedSelectedOrgs);
        }
    };

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
                        <XInput id='password' disabled={edit ? true : false} type="password" label="Password" value={password} onChange={(e) => onInputChange(e)} required fullWidth/>
                        <XInput id='password2' disabled={edit ? true : false} type="password" label="Repeat password" value={password2} onChange={(e) => onInputChange(e)} required fullWidth/>
                    </StyledPageMarginContainer>
                    </XCard>
                    {edit ? null : ( 
                        <XCard title='Client Organization Data (Optional)' tooltip={tooltip}>
                            <StyledPageMarginContainer>
                                <Stack spacing={3}  direction="column" justifyContent="flex-start" alignItems="center" sx={{marginBottom: 4}}>
                                <XInput id='organization_name' type="organization_name" label="Organization name" value={organization_name} onChange={(e) => onInputChange(e)} fullWidth/>
                                <XInput id='organization_description' type="organization_description" label="Organization Description" value={organization_description} onChange={(e) => onInputChange(e)} fullWidth/></Stack>
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
                    </StyledPageContainer>
                 )}
            </StyledForm>
    )
}

export default ClientForm