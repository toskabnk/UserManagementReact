export default class User {
    constructor(userDTO) {
        this.id = userDTO.id || null;
        this.name = userDTO.name;
        this.email = userDTO.email;
        this.emailVerifiedAt = userDTO.email_verfied_at || null;
        this.createdAt = userDTO.created_at || null;
        this.updatedAt = userDTO.updated_at || null;
        this.surname = userDTO.surname;
        this.birthDate = userDTO.birth_date;
        this.password = userDTO.password || '';
        this.passwordConfirmation = userDTO.password_confirmation || '';
        this.roles = userDTO.roles || null;
        this.organizations = userDTO.organizations || null;
    }
    toDTO(){
        const dto = {
            name: this.name,
            surname: this.surname,
            birth_date: this.birthDate,
            email: this.email,
            password: this.password,
            password_confirmation: this.passwordConfirmation,
        }

        if(this.roles !== null) {
            dto.roles = this.roles;
        }

        if(this.organizations !== null) {
            dto.organizations = this.organizations;
        }
        
        return dto;
    }
}