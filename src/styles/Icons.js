import styled from 'styled-components';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    margin-right: ${(props) => props.hasMarginRight ? '6px' : '0px'};
    margin-left: ${(props) => props.hasMarginLeft ? '6px' : '0px'};
    cursor: ${(props) => props.hasPointer ? 'pointer' : 'unset'};
    color : ${(props) => 
        props.isError ? '#E13144'
        : props.isSuccess ? '#4BA0A0'
        : props.isWarning ? '#F6AB0E'
        : props.isInfo ? '#5C9AD0'
        : props.isColor ? props.isColor 
        : 'unset'
    }
`

export const PlusIcon = styled(AddBoxIcon)`
    // color:  ${props => props.theme.palette.primary.main};
    cursor: pointer;
    color: #43a1a2;
    font-size: 2rem;
`;

export const TrashIcon = styled(DeleteIcon)`
    cursor: pointer;
    background-color: #43a1a2;
    font-size: 1.5rem;
    border-radius: 30%;
    color: white;
`;

export const CopyIcon = styled(ContentCopyIcon)`
    cursor: pointer;
    background-color: #43a1a2;
    font-size: 1.5rem;
    border-radius: 30%;
    color: white;
`;