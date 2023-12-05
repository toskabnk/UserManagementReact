import * as styled from '../styles/NavBarStyles';
import { useAuth } from '../providers/AuthProvider/AuthContext';
import { useSelector } from 'react-redux';

export function Navbar() {  

    const { isAuthenticated, isAdmin, isSuperAdmin, logout } = useAuth();
    const name = useSelector((state) => state.user.name)
    
    return(
            <styled.NavBar>
                <styled.Logo src="https://openexpoeurope.com/wp-content/uploads/2016/12/Logo_ximdex_transpa_med.png"></styled.Logo>
                <styled.NavBarList>
                    {isAuthenticated ? (
                    <>
                        <styled.NavBarItems>
                            <styled.NavBarLink to='/'>Index</styled.NavBarLink>
                        </styled.NavBarItems>
                        {isAdmin || isSuperAdmin ? (
                            <>
                                <styled.NavBarItems>
                                    <styled.NavBarLink to='/users'>Users</styled.NavBarLink>
                                </styled.NavBarItems>
                                {isSuperAdmin ? (
                                    <styled.NavBarItems>
                                    <styled.NavBarLink to='/clients'>Clients</styled.NavBarLink>
                                </styled.NavBarItems>
                                ) : (null)}
                                <styled.NavBarItems>
                                    <styled.NavBarLink to='/roles'>Roles</styled.NavBarLink>
                                </styled.NavBarItems>
                                <styled.NavBarItems>
                                    <styled.NavBarLink to='/organizations'>Organizations</styled.NavBarLink>
                                </styled.NavBarItems>
                            </>
                        ) : (
                            <>
                             {/* Nada de momento */}
                            </>
                        )}
                        <styled.RightNavItem>
                            <styled.NavBarLink to='/user'>{name}</styled.NavBarLink>
                        </styled.RightNavItem>
                        <styled.RightNavItem>
                            <styled.NavBarLogout onClick={logout}>Logout</styled.NavBarLogout>
                        </styled.RightNavItem>
                    </>
                    ):(
                    <>
                        <styled.RightNavItem>
                            <styled.NavBarLink to='/login'>Login</styled.NavBarLink>
                        </styled.RightNavItem>
                        <styled.RightNavItem>
                            <styled.NavBarLink to='/register'>Register</styled.NavBarLink>
                        </styled.RightNavItem>
                    </>
                    )}
                </styled.NavBarList>
            </styled.NavBar>
    );
    
}