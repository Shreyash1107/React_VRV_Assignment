import React, { useState, useEffect } from "react";

const UpdateUsers = () => {
    const [users, setUsers] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [errors, setErrors] = useState({});

    // Sample data fetching (You can replace this with an API call)
    useEffect(() => {
        const fetchUsers = async () => {
            // Simulating an API call to fetch users
            const fetchedUsers = [
                { id: 1, name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
                { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", status: "inactive" },
                // Add more users here...
            ];
            setUsers(fetchedUsers);
        };
        fetchUsers();
    }, []);

    // Handle Update Click
    const handleUpdateClick = (user) => {
        setSelectedUser(user);
        setShowUpdateModal(true);
    };

    // Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({
            ...selectedUser,
            [name]: value,
        });
    };

    // Validate form fields
    const validateForm = () => {
        const validationErrors = {};
        if (!selectedUser?.name) validationErrors.name = "Name is required";
        if (!selectedUser?.email) validationErrors.email = "Email is required";
        if (!selectedUser?.role) validationErrors.role = "Role is required";
        if (!selectedUser?.status) validationErrors.status = "Status is required";
        return validationErrors;
    };

    // Handle Update Form Submission
    const handleUpdate = (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Simulate an API call to update the user
        // Update the users list or API response handling here
        const updatedUsers = users.map(user =>
            user.id === selectedUser.id ? selectedUser : user
        );
        setUsers(updatedUsers);

        // Close the modal after updating
        setShowUpdateModal(false);
    };

    return (
        <div className="container">
            <h2>Manage Users</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => handleUpdateClick(user)}
                                >
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Update User Modal */}
            {showUpdateModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update User</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setShowUpdateModal(false)}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={selectedUser?.name || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={selectedUser?.email || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={selectedUser?.password || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors.password && <div className="text-danger">{errors.password}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label>Role</label>
                                        <select
                                            className="form-control"
                                            name="role"
                                            value={selectedUser?.role || ''}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select role</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                        {errors.role && <div className="text-danger">{errors.role}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            className="form-control"
                                            name="status"
                                            value={selectedUser?.status || ''}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        {errors.status && <div className="text-danger">{errors.status}</div>}
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        Update User
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateUsers;
