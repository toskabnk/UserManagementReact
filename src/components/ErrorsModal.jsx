import { DivErrorMessages, ElementErrorMessages, ListErrorMessages, StyledP } from "../styles/ErrorMessagesStyles"
import { StyledModal } from "../styles/StyledModel"

const ErrorsModal = ({openModal, setOpenModal, errors}) => {
    return (
        <StyledModal setOpenModal={setOpenModal} openModal={openModal}>
            {errors && (
                <DivErrorMessages>
                    <StyledP>Errors: </StyledP>
                    <ListErrorMessages>
                        {Object.keys(errors).map(key => (
                        <ElementErrorMessages key={key}>{errors[key][0]}</ElementErrorMessages>
                        ))}
                    </ListErrorMessages>
                </DivErrorMessages>
            )}
        </StyledModal>
    )
}

export default ErrorsModal