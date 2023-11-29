import styled from "styled-components";
import { XContainerContent, XCard, XTag, XBox } from "@ximdex/xui-react/material";

export const StyledCenteredXYDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    min-height: 100vh;
    margin: 0 5vw;
`

export const StyledPoweredByContainer = styled.div`
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 200px;
    margin: calc(1rem - 8px);
`;

export const StyledDivFlexStartWrap = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 0.25rem;
    
    & .css-5x384n-MuiAutocomplete-root, .css-89vv9g-MuiAutocomplete-root, .css-y9f21q-MuiFormControl-root-MuiTextField-root {
       & input {
            padding: 0 !important;
        }
        & label {
            margin-top: -5px !important;
        }
    }

    & .css-17vbkzs-MuiFormControl-root-MuiTextField-root{
        margin-top: 0 !important;
    }
`;

export const StyledHeaderListDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-flow: wrap;
    margin: 0 0 16px 0;
`;

export const StyledDivFlexAroundWrap = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
`;

export const StyledDivFlexWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

export const StyledDivFlexBetween = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-flow: wrap;
    margin: 0.5rem 0;
`;


export const StyledActivityCardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
`;

export const StyledPageContainer = styled.div`
    margin: 0 2rem;
`;

export const StyledPageMarginContainer = styled.div`
    margin: 1rem 2rem;
`;

export const StyledFeedbackContainer = styled.div`
    display: flex;
    align-items: end;
`;

export const StyledDivCenterY = styled.div`
    display: flex;
    align-items: center;
`

export const StyledUserId = styled.p`
    margin: 1rem;
    width: max-content;
`;

export const StyledButtonCenterContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 1rem;
`;

export const StyledGrid = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: calc(100VH - 82px);
`;

export const StyledActivitiesListContainer = styled.div`
    padding: 1rem;
    background: #EAEAEA;
`;

export const ActivityRow = styled.div`
    display: grid;
    grid-template-columns: 100px auto 210px 135px;
    grid-column-gap: 1rem;
    padding: 0.25rem 0.75rem;
    min-height: 65px;
    align-items: center;
    border: 0.5px solid #BBBBBB;
    background: #FBFBFB;
`;

export const ActivityRowDetails = styled.div`
    display: grid;
    padding: 0.5rem;
    align-items: center;
    border: 0.25px solid #DDD;
    background: white;
    grid-template-columns: 0.25fr 2.25fr 0.75fr;
    margin: 0 0 0 6px;
`;

export const ActivityRowDateDetails = styled(ActivityRowDetails)`
    border: 0.5px solid #BBBBBB;
    border-top: 0.5px solid #FFF;
    background: #FBFBFB;
    margin: -5px 0 0 0;    
    padding: 0 0.5rem;
    grid-template-columns: 2.5fr 0.75fr;
    justify-items: self-end;
`;

export const ActivityRowDetailsArchived = styled(ActivityRowDetails)`
    grid-template-columns: 1fr;

    >p {
        margin: 6px;
    }
`;

export const AssessmentRow = styled.div`
    display: grid;
    grid-template-columns: 85px auto 160px 120px;
    grid-column-gap: 1rem;
    padding: 0.25rem 0.75rem;
    min-height: 65px;    
    align-items: center;
    border: 0.5px solid #BBBBBB;
    background: #FBFBFB;
`;

export const AssessmentRowDetails = styled(AssessmentRow)`
    border: 0.25px solid #DDD;
    background: white;
    display: grid;
    align-items: center;
    grid-template-columns: 0.30fr 2.0fr 0.75fr;
    grid-column-gap: 1rem;
    margin: 0 0 0 6px;
`

export const StyledButtonsContainer = styled.div`
    background: #43a1a2;
    color: white;
    width: 25px;
    height: 25px;
    border-radius: 5px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 0.25rem;
    cursor: pointer;
`;

export const StyledActionsEditTranslations = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export const StyledSpaceAroundDiv = styled.div`
    display: flex;
    justify-content: space-around;
`
export const StyledSearchContainer = styled.div`
    padding: 1rem;
    background: #E0E0E0;
    min-width: 300px;
    width: 22vw;
`

export const StyledTagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0.5rem;
`;

export const StyledTagContainerForIdentifyingData = styled(StyledTagContainer)`
    margin: 0 0 0 89px;
`

export const StyledImgPairingContainer = styled.div`
    text-align: center;
    margin-bottom: 8px;
    max-width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const StyledContainerButtonsList = styled.div`
    display: flex;
    justify-content: end;
`;


export const StyledContainerPreviewSpinner = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const StyledXContainerPreview = styled(XContainerContent)`
    display: flex; 
    flex-direction: column;
    justify-content: space-around; 
    height: calc(100vh - 82px);
`

export const StyledHeaderContainer = styled.div`
    height: 60px;
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0,0,0,.125);
    box-shadow: 0 2px 2px -2px rgb(0 0 0 / 34%);
    background: white;
    > h1, > div > h1 {
        font-size: 1em;
        margin: 0;
        align-self: center;
    }
`

export const StyledTargetsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    width: 100%;
`


export const StyledFilterXCard = styled(XCard)`
    padding: 0 0.75em;
`

export const StyledFilterInputDiv = styled.div`
    display: inline-flex;
    width: 100%;
    margin-bottom: 0.5em;
`

export const StyledFilterTags = styled(XTag)`
    background-color: rgb(251, 251, 251); 
    border: 1px solid rgb(187, 187, 187);
    margin-bottom: 6px;
`

export const StyledHomeXBox = styled(XBox)`
    width: 150px !important; 
    height: 150px; 
    display: flex; 
    place-content: center;
    align-items: center;
`

export const StyledFullCenter = styled('div')`
  width: 100%;
  background-color: #eeeeee;
`