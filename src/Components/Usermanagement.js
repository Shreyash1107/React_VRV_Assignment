import React, { useState, useEffect } from "react";
import "./style.css";

const ManageUsers = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
        status: "",
    });
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [userToDelete, setUserToDelete] = useState(null);
    const [userToUpdate, setUserToUpdate] = useState(null); // Track user to update
    const [lastUserId, setLastUserId] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState(""); // For search query

    useEffect(() => {
        const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(savedUsers);

        const lastId = savedUsers.length > 0 ? Math.max(...savedUsers.map(user => user.id)) : 0;
        setLastUserId(lastId);
    }, []);

    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateField = (field, value) => {
        let error = "";

        if (field === "username" && (!value || value.length < 3)) {
            error = "Username must be at least 3 characters long.";
        } else if (field === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
            error = "Invalid email address.";
        } else if (field === "password" && value.length < 6) {
            error = "Password must be at least 6 characters.";
        } else if ((field === "role" || field === "status") && !value) {
            error = `Please select a ${field}.`;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));

        return error;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formErrors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) {
                formErrors[field] = error;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const newUser = { id: lastUserId + 1, ...formData };
        setUsers([...users, newUser]);
        setLastUserId(lastUserId + 1);
        setFormData({ username: "", email: "", password: "", role: "", status: "" });
        setShowModal(false);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setUsers(users.filter((user) => user.id !== userToDelete.id));
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const handleUpdateClick = (user) => {
        setFormData({
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            status: user.status,
        });
        setShowUpdateModal(true);
        setUserToUpdate(user);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();

        const formErrors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) {
                formErrors[field] = error;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const updatedUsers = users.map((user) =>
            user.id === userToUpdate.id ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
        setShowUpdateModal(false);
        setUserToUpdate(null);
        setFormData({ username: "", email: "", password: "", role: "", status: "" });
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    // Search filter
    const filteredUsers = currentUsers.filter((user) => {
        return (
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Manage Users</h1>
            <div className="d-flex justify-content-between mb-3">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search by name, email, or role"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    Add New User
                </button>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>{user.role}</td>
                                <td>{user.status}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() => handleUpdateClick(user)}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        className="btn btn-sm btn-danger ml-2"
                                        onClick={() => handleDeleteClick(user)}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No users available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                            Previous
                        </button>
                    </li>
                    {pageNumbers.map((number) => (
                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(number)}>
                                {number}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Modal for Adding New User */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5 className="modal-title">Add New User</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>


                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                        {errors.username && <small className="text-danger">{errors.username}</small>}
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {errors.email && <small className="text-danger">{errors.email}</small>}
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                        {errors.password && <small className="text-danger">{errors.password}</small>}
                                    </div>
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select
                                            className="form-control"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Contributor">Contributor</option>
                                            <option value="Editor">Editor</option>
                                            <option value="Viewer">Viewer</option>
                                            <option value="Moderator">Moderator</option>
                                            <option value="Developer">Developer</option>
                                            <option value="Support">Support</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Tester">Tester</option>
                                            <option value="Ananlyst">Analyst</option>
                                        </select>
                                        {errors.role && <small className="text-danger">{errors.role}</small>}
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            className="form-control"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        {errors.status && <small className="text-danger">{errors.status}</small>}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-success">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Confirming Delete */}
            {showDeleteModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this user?</p>
                                <div className="form-group text-center">
                                    <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>&nbsp;&nbsp;
                                    <button className="btn btn-secondary ml-2" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Updating User */}
            {showUpdateModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5 className="modal-title">Update User</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowUpdateModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleUpdateSubmit}>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                        {errors.username && <small className="text-danger">{errors.username}</small>}
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {errors.email && <small className="text-danger">{errors.email}</small>}
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                        {errors.password && <small className="text-danger">{errors.password}</small>}
                                    </div>
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select
                                            className="form-control"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Contributor">Contributor</option>
                                            <option value="Editor">Editor</option>
                                            <option value="Viewer">Viewer</option>
                                            <option value="Moderator">Moderator</option>
                                            <option value="Developer">Developer</option>
                                            <option value="Support">Support</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Tester">Tester</option>
                                            <option value="Ananlyst">Analyst</option>
                                        </select>
                                        {errors.role && <small className="text-danger">{errors.role}</small>}
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            className="form-control"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        {errors.status && <small className="text-danger">{errors.status}</small>}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-success">
                                            Update User
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
