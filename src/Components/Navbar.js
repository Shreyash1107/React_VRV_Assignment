import React from "react";
import { Link } from "react-router-dom";
import "./style.css"
const Navigation = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <a className="navbar-brand text-white" href="#">Role Based Access</a>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <Link className="nav-link text-white" to="/manage-users">Manage Users</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/role-management">Role Management</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/permissions">Permissions</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;
