import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./Components/Navbar";
import ManageUsers from "./Components/Usermanagement"; // The User Management component
import RoleManagement from "./Components/RoleManagement"; // The Role Management component
import PermissionManagement from "./Components/Permissionmanage"; // Fixed typo

const App = () => {
    return (
        <Router>
            {/* Navigation Bar */}
            <Navigation />

            {/* Routes */}
            <div className="container mt-4">
                <Routes>
                    <Route path="/manage-users" element={<ManageUsers />} />
                    <Route path="/role-management" element={<RoleManagement />} />
                    <Route path="/permissions" element={<PermissionManagement />} /> {/* Fixed */}
                    {/* Add more routes as needed */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
