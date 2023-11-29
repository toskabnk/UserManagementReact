import React from 'react';
import { Routes as ReactRoutes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import Users from '../pages/Users'
import Register from '../pages/Register'
import LoginPage from '../pages/Login'
import Logout from '../pages/Logout'
import User from '../pages/User'
import Roles from '../pages/Roles'
import Organizations from '../pages/Organizations'
import CreateMember from '../pages/CreateMember';
import EditMember from '../pages/EditMember';
import CreateRole from '../pages/CreateRole';
import Clients from '../pages/Clients';
import CreateClient from '../pages/CreateClient';
import EditClient from '../pages/EditClient';
import EditRole from '../pages/EditRoles';
import CreateOrganization from '../pages/CreateOrganization';
import EditOrganization from '../pages/EditOrganization';
import ProtectedSuperAdminRoute from './ProtectedSuperAdmin';
import ProtectedRoute from './ProtectedRoute';
import ProtectedAdminRoutes from './ProtectedAdminRoutes';

const Routes = () => {
    return (
        <ReactRoutes>
            {/* Rutas publicas */}
            <Route path="/register" element={<Register/> } />
            <Route path="/login" element={<LoginPage/> } />
            <Route path="/logout" element={<Logout/> } />
            <Route path="*" element={<Home/> } /> 
            
            {/* Rutas privadas */}
            <Route element={<ProtectedRoute/>}>
                <Route path="/user" element={<User/> } />

                {/* Rutas privadas de administrador */}
                <Route element={<ProtectedAdminRoutes/>}>
                    <Route path="/users" element={<Users/> } />
                    <Route path="/roles" element={<Roles/> } />
                    <Route path="/organizations" element={<Organizations/> } /> 
                    <Route path="/createMember" element={<CreateMember/> }/>
                    <Route path="/editMember" element={<EditMember/> }/>
                    <Route path="/createRole" element={<CreateRole/> }/>
                    <Route path="/editRole" element={<EditRole/> }/>
                    <Route path="/createOrganization" element={<CreateOrganization/> }/>
                    <Route path="/editOrganization" element={<EditOrganization/> } />

                    {/* Rutas privadas de super administrador */}
                    <Route element={<ProtectedSuperAdminRoute/>}>
                        <Route path="/clients" element={<Clients/> } />
                        <Route path="/createClient" element={<CreateClient/> }/>
                        <Route path="/editClient" element={<EditClient/> }/>
                    </Route>
                </Route>
            </Route>
        </ReactRoutes>
    )
};

export default Routes;