import {useSelector} from "react-redux"
import {Navigate, Outlet, useLocation} from "react-router-dom"

const ProtectedSuperAdminRoute = ({children}) => {
    const user = useSelector((state) => state.user);
    let location = useLocation();

    if(!user.roles.some(role => role.name === "SuperAdmin")) {
        return <Navigate to="/" state={{ from: location}} replace />
    }
    return children ? children : <Outlet />;
};

export default ProtectedSuperAdminRoute;