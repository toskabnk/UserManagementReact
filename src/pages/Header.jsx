import React from 'react';
import * as styled from '../styles/NavBarStyles';
import { useAuth } from '../providers/AuthProvider/AuthContext';

export function Navbar() {  

    const { isAuthenticated, name, logout } = useAuth();

    return(<>
        <header>
            <styled.NavBar>
                <styled.Logo src="https://openexpoeurope.com/wp-content/uploads/2016/12/Logo_ximdex_transpa_med.png"></styled.Logo>
                <styled.NavBarList>
                    <styled.NavBarItems>
                        <styled.NavBarLink to='/'>Home</styled.NavBarLink>
                    </styled.NavBarItems>
                    <styled.NavBarItems>
                        <styled.NavBarLink to='/users'>Users</styled.NavBarLink>
                    </styled.NavBarItems>
                    {isAuthenticated ? (
                    <>
                        <styled.RightNavItem>
                            <styled.NavBarLink to='/user'>{name}</styled.NavBarLink>
                        </styled.RightNavItem><styled.RightNavItem>
                        <styled.NavBarLogout onClick={logout}>Logout</styled.NavBarLogout>
                        </styled.RightNavItem>
                    </>
                    ):(
                    <>
                        <styled.RightNavItem>
                            <styled.NavBarLink to='/login'>Login</styled.NavBarLink>
                        </styled.RightNavItem><styled.RightNavItem>
                            <styled.NavBarLink to='/register'>Register</styled.NavBarLink>
                        </styled.RightNavItem>
                    </>
                    )}
                </styled.NavBarList>
            </styled.NavBar>
        </header>
    </>);
    
}