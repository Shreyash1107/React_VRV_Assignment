import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PermissionManagement = () => {
    const [permissions, setPermissions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
    const [currentPermission, setCurrentPermission] = useState({ id: "", name: "", description: "", role: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Delete confirmation modal state
    const [permissionToDelete, setPermissionToDelete] = useState(null); // Permission to be deleted

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [permissionsPerPage] = useState(5); // Number of permissions per page

    useEffect(() => {
        const fetchPermissions = async () => {
            const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
            setPermissions(storedPermissions);
        };
        fetchPermissions();
    }, []);

    useEffect(() => {
        localStorage.setItem("permissions", JSON.stringify(permissions));
    }, [permissions]);

    const handleModalOpen = (type, permission = null) => {
        setModalType(type);
        setCurrentPermission(permission || { id: "", name: "", description: "", role: "" });
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentPermission({ ...currentPermission, [name]: value });
    };

    const handleSave = () => {
        if (modalType === "add") {
            const newPermission = {
                ...currentPermission,
                id: permissions.length > 0 ? Math.max(...permissions.map((p) => p.id)) + 1 : 1,
            };
            setPermissions([...permissions, newPermission]);
        } else if (modalType === "edit") {
            setPermissions(
                permissions.map((permission) => (permission.id === currentPermission.id ? currentPermission : permission))
            );
        }
        handleModalClose();
    };

    const handleDelete = () => {
        setPermissions(permissions.filter((permission) => permission.id !== permissionToDelete));
        setShowDeleteConfirm(false);
    };

    const filteredPermissions = permissions.filter(
        (permission) =>
            permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastPermission = currentPage * permissionsPerPage;
    const indexOfFirstPermission = indexOfLastPermission - permissionsPerPage;
    const currentPermissions = filteredPermissions.slice(indexOfFirstPermission, indexOfLastPermission);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredPermissions.length / permissionsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Permission Management</h1>

            {/* Search Input and Add Permission Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search permissions"
                />
                <Button variant="primary" onClick={() => handleModalOpen("add")}>
                    Assign Permission
                </Button>
            </div>

            {/* Permissions Table */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Assigned Permissions</th>
                        <th>Description</th>
                        <th>Role</th> {/* New column for Role */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPermissions.length > 0 ? (
                        currentPermissions.map((permission) => (
                            <tr key={permission.id}>
                                <td>{permission.id}</td>
                                <td>{permission.name}</td>
                                <td>{permission.description}</td>
                                <td>{permission.role}</td> {/* Display the Role */}
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleModalOpen("edit", permission)}
                                    >
                                       <i className="fa-solid fa-pen"></i>
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            setPermissionToDelete(permission.id);
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
                                No permissions available.
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

            {/* Modal for Add/Edit Permission */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === "add" ? "Add Permission" : "Edit Permission"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Permission Assigned</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Assigned Permissions"
                                name="name"
                                value={currentPermission?.name || ""}
                                onChange={handleFormChange}
                                style={{ height: '50px', fontSize: '16px' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                name="description"
                                value={currentPermission?.description || ""}
                                onChange={handleFormChange}
                                style={{ height: '50px', fontSize: '16px' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                name="role"
                                value={currentPermission?.role || ""}
                                onChange={handleFormChange}
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
                                <option value="Analyst">Analyst</option>
                            </Form.Control>
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
                    <Modal.Title>Delete Permission</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this permission?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PermissionManagement;
