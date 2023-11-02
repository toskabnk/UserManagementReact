import React from 'react';
import styled, {css} from 'styled-components';

export const DivErrorMessages = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
`;

export const ListErrorMessages = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    text-align: center;
`;

export const ElementErrorMessages = styled.li`
    width: 250px;
`;