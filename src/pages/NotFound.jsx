import React from 'react'
import { useNavigate } from 'react-router-dom'
import { XButton } from '@ximdex/xui-react/material'
import { StyledCenteredXYDiv, StyledPageStatusHeader, StyledPageStatusImg } from '../styles/Containers'
import { StyledFontAwesomeIcon } from '../styles/Icons'
import notFound from '../assets/undraw-page-not-found.svg'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <StyledCenteredXYDiv>
            <StyledPageStatusImg src={notFound} />  
            <StyledPageStatusHeader>Page not found</StyledPageStatusHeader>          
            <div style={{ margin: '5em auto 0.5em'}}>
                <XButton onClick={() => navigate(-1)} size='small'>
                    <StyledFontAwesomeIcon icon={['fa', 'angle-left']} title="Go to previous page" hasMarginRight />
                    Go Back
                </XButton>
            </div>
        </StyledCenteredXYDiv>
    )
}

export default NotFound