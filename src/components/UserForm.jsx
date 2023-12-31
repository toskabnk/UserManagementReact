import { StyledPageContainer, StyledPageMarginContainer } from "../styles/Containers";
import { XCard, XDropdown, XInput } from '@ximdex/xui-react/material';
import { Stack} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCoffee} from "@fortawesome/free-solid-svg-icons";
import { StyledForm } from '../styles/FormStyles';
import { CenteredSpinner } from "../styles/Spinner";


const UserForm = ({user, setUser, selectedRoles, setSelectedRoles, selectedOrgs, setSelectedOrgs, rolesFixed, orgFixed, loading, handleSubmit, dataLoading=false, edit=false}) => {
    
    const onInputChange = (e) => {
        setUser({
            ...user,
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

    const {name, surname, birthDate, email, password, password2} = user;

    const tooltip = <FontAwesomeIcon icon={faPenToSquare} size='1x' title={edit ? 'Edit User' : 'Create User'} />;

    return (
        <StyledForm onSubmit={handleSubmit}>
                
                {dataLoading ? (<CenteredSpinner top={"45%"} left={"45%"}/>)
                 : (
                    <StyledPageContainer>
                    <h2>{edit ? 'Edit User Form' : 'Create User Form'}</h2>
                    <XCard title='User data' isCollapsable={true} tooltip={tooltip}>
                    <StyledPageMarginContainer>
                        <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                            <XInput id='name' type="text" label="First Name" value={name} onChange={(e) => onInputChange(e)} fullWidth required/>
                            <XInput id='surname' type="text" label="Last Name" value={surname} onChange={(e) => onInputChange(e)} fullWidth required/>
                        </Stack>
                        <XInput id='birthDate' type="date" label="Date of Birth" value={birthDate} onChange={(e) => onInputChange(e)} fullWidth required sx={{mb: 4}}/>
                        <XInput id='email' type="email" label="Email" value={email} onChange={(e) => onInputChange(e)} fullWidth required sx={{mb: 4}}/>
                        <XInput id='password' disabled={edit ? true : false} type="password" label="Password" value={password} onChange={(e) => onInputChange(e)} required fullWidth sx={{mb: 4}}/>
                        <XInput id='password2' disabled={edit ? true : false} type="password" label="Repeat password" value={password2} onChange={(e) => onInputChange(e)} required fullWidth sx={{mb: 4}}/>
                    </StyledPageMarginContainer>
                    </XCard>
                    <XCard title='Roles' isCollapsable={true} tooltip={tooltip}>
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
                                <XDropdown options={orgFixed} 
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(e, values) => setSelectedOrgs(values)}
                                    multiple 
                                    value={selectedOrgs}
                                    label='Organizations'
                                    labelOptions='name'
                                    bgColor='100'
                                    renderOption={(option) => option.name}/>
                            </Stack>
                        </StyledPageMarginContainer>
                    </XCard>
                    <LoadingButton loading={loading} variant="outlined" type="submit">
                        <span>{edit ? 'Edit User' : 'Create User'}</span>
                    </LoadingButton>
                    </StyledPageContainer>
                 )}
            </StyledForm>
    )
}

export default UserForm