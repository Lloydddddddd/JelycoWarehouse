import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/PageHeader";
import PageCard from "../components/common/PageCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import SearchBar from "../components/common/SearchBar";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";
import DataTable, {
    type Column,
} from "../components/common/DataTable";

import Button from "../components/ui/Button";
import UserForm from "../components/users/UserForm";

import {
    getUsers,
    createUser,
    updateUser,
    updateUserStatus,
} from "../services/adminUserService";

import type { User } from "../models/user";
import type { CreateUserRequest } from "../models/CreateUserRequest";
import type { UpdateUserRequest } from "../models/UpdateUserRequest";
import type { OperationResult } from "../models/OperationResult";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState<User | null>(null);

    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "success" as "success" | "error",
    });

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);

            const result = await getUsers();

            setUsers(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function showToast(
        message: string,
        type: "success" | "error"
    ) {
        setToast({
            visible: true,
            message,
            type,
        });

        setTimeout(() => {
            setToast((prev) => ({
                ...prev,
                visible: false,
            }));
        }, 3000);
    }

    async function handleSubmitUser(
        data: CreateUserRequest
    ) {
        try {
            let result: OperationResult;

            if (editingUser) {
                const updateRequest: UpdateUserRequest = {
                    fullName: data.fullName,
                    email: data.email,
                    role: data.role,
                };

                result = await updateUser(
                    editingUser.id,
                    updateRequest
                );
            } else {
                result = await createUser(data);
            }

            showToast(result.message, "success");

            setShowCreateModal(false);
            setEditingUser(null);

            await loadUsers();
        } catch (error) {
            console.error(error);

            showToast(
                error instanceof Error
                    ? error.message
                    : "Unable to save user.",
                "error"
            );
        }
    }

    async function handleToggleStatus(
        user: User
    ) {
        try {
            const result = await updateUserStatus(
                user.id,
                {
                    isActive: !user.isActive,
                }
            );

            showToast(result.message, "success");

            await loadUsers();
        } catch (error) {
            console.error(error);

            showToast(
                error instanceof Error
                    ? error.message
                    : "Unable to update user status.",
                "error"
            );
        }
    }

    const filteredUsers = useMemo(() => {
        if (!search.trim()) {
            return users;
        }

        const keyword = search.toLowerCase();

        return users.filter(
            (user) =>
                user.fullName.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword) ||
                user.role.toLowerCase().includes(keyword)
        );
    }, [users, search]);

    const columns: Column<User>[] = [
        {
            header: "Full Name",
            accessor: "fullName",
            sortable: true,
        },
        {
            header: "Email",
            accessor: "email",
            sortable: true,
        },
        {
            header: "Role",
            accessor: "role",
            sortable: true,
        },
        {
            header: "Status",
            render: (user) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <span
                        style={{
                            color: user.isActive
                                ? "#16a34a"
                                : "#dc2626",
                            fontWeight: 600,
                        }}
                    >
                        {user.isActive
                            ? "● Active"
                            : "● Inactive"}
                    </span>

                    <Button
                        variant={
                            user.isActive
                                ? "danger"
                                : "secondary"
                        }
                        onClick={() =>
                            handleToggleStatus(user)
                        }
                    >
                        {user.isActive
                            ? "Deactivate"
                            : "Activate"}
                    </Button>
                </div>
            ),
        },
        {
            header: "Actions",
            render: (user) => (
                <Button
                    variant="secondary"
                    onClick={() => {
                        setEditingUser(user);
                        setShowCreateModal(true);
                    }}
                >
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <>
            <PageHeader
                title="Users"
                subtitle="Manage warehouse user accounts."
            />

            <PageCard>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search users..."
                    />

                    <Button
                        onClick={() => {
                            setEditingUser(null);
                            setShowCreateModal(true);
                        }}
                    >
                        + Add User
                    </Button>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : filteredUsers.length === 0 ? (
                    <EmptyState
                        title="No users found"
                        message="No user matches your search."
                    />
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        rowKey={(user) => user.id}
                    />
                )}
            </PageCard>

            <Modal
                open={showCreateModal}
                title={
                    editingUser
                        ? "Edit User"
                        : "Create User"
                }
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                }}
            >
                <UserForm
                    user={editingUser}
                    onSubmit={handleSubmitUser}
                />
            </Modal>

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}