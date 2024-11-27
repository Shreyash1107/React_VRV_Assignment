import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./role.css";

const RoleManagement = () => {
    const [roles, setRoles] = useState([]); // Dynamic roles state
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
    const [currentRole, setCurrentRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Delete confirmation modal state
    const [roleToDelete, setRoleToDelete] = useState(null); // Role to be deleted

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rolesPerPage] = useState(5); // Number of roles per page

    // Simulate fetching data dynamically
    useEffect(() => {
        const fetchRoles = async () => {
            const storedRoles = JSON.parse(localStorage.getItem("roles")) || [];
            setRoles(storedRoles); // Set roles dynamically from localStorage
        };
        fetchRoles();
    }, []);

    // Save roles to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("roles", JSON.stringify(roles));
    }, [roles]);

    const handleModalOpen = (type, role = null) => {
        setModalType(type);
        setCurrentRole(role || { id: "", name: "", description: "", permissions: "" });
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentRole({ ...currentRole, [name]: value });
    };

    const handleSave = () => {
        if (modalType === "add") {
            const newRole = {
                ...currentRole,
                id: roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1,
            };
            setRoles([...roles, newRole]);
        } else if (modalType === "edit") {
            setRoles(
                roles.map((role) => (role.id === currentRole.id ? currentRole : role))
            );
        }
        handleModalClose();
    };

    const handleDelete = (id) => {
        setRoles(roles.filter((role) => role.id !== id));
        setShowDeleteConfirm(false); // Close the confirmation modal
    };

    const filteredRoles = roles.filter(
        (role) =>
            role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.permissions.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastRole = currentPage * rolesPerPage;
    const indexOfFirstRole = indexOfLastRole - rolesPerPage;
    const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredRoles.length / rolesPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Remove the already existing roles from the dropdown options
    const defaultRoles = [
        "Admin",
        "Contributor",
        "Editor",
        "Viewer",
        "Moderator",
        "Developer",
        "Support",
        "Manager",
        "Tester",
        "Analyst",
    ];

    const dropdownRoles = defaultRoles.filter(
        (role) => !roles.some((r) => r.name === role)
    );

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Role Management</h1>

            {/* Search Input and Add Role Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search roles"
                />
                <Button variant="primary" onClick={() => handleModalOpen("add")}>
                    Add Role
                </Button>
            </div>

            {/* Roles Table */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Permissions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRoles.length > 0 ? (
                        currentRoles.map((role) => (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                                <td>{role.description}</td>
                                <td>{role.permissions}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleModalOpen("edit", role)}
                                    >
                                       <i className="fa-solid fa-pen"></i>
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            setRoleToDelete(role.id);
                                            setShowDeleteConfirm(true);
                                        }}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No roles available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <Button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </Button>
                        </li>
                        {pageNumbers.map((number) => (
                            <li key={number} className="page-item">
                                <Button
                                    className="page-link"
                                    onClick={() => handlePageChange(number)}
                                >
                                    {number}
                                </Button>
                            </li>
                        ))}
                        <li className="page-item">
                            <Button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pageNumbers.length}
                            >
                                Next
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Modal for Add/Edit Role */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === "add" ? "Add Role" : "Edit Role"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Dropdown for Role Name */}
                        <Form.Group className="mb-3">
                            <Form.Label>Role Name</Form.Label>
                            <Form.Control
                                as="select"
                                name="name"
                                value={currentRole?.name || ""}
                                onChange={handleFormChange}
                            >
                                <option value="">Select a Role</option>
                                {dropdownRoles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                name="description"
                                value={currentRole?.description || ""}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Permissions</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter permissions"
                                name="permissions"
                                value={currentRole?.permissions || ""}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this role?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleDelete(roleToDelete)}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RoleManagement;
