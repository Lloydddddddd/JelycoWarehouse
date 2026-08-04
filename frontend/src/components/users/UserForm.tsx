import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

import type { User } from "../../models/user";
import type { CreateUserRequest } from "../../models/CreateUserRequest";

import styles from "./UserForm.module.css";

interface UserFormProps {
    user?: User | null;

    onSubmit(
        data: CreateUserRequest
    ): Promise<void>;
}

const initialForm: CreateUserRequest = {
    fullName: "",
    email: "",
    password: "",
    role: "Staff",
};

export default function UserForm({
    user,
    onSubmit,
}: UserFormProps) {

    const [form, setForm] =
        useState<CreateUserRequest>(initialForm);

    useEffect(() => {

        if (user) {
            setForm({
                fullName: user.fullName,
                email: user.email,
                password: "",
                role: user.role,
            });
        }
        else {
            setForm(initialForm);
        }

    }, [user]);

    function update<K extends keyof CreateUserRequest>(
        key: K,
        value: CreateUserRequest[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        await onSubmit(form);

        if (!user) {
            setForm(initialForm);
        }
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
        >

            <Input
                label="Full Name"
                value={form.fullName}
                onChange={(e) =>
                    update("fullName", e.target.value)
                }
            />

            <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                    update("email", e.target.value)
                }
            />

            {!user && (
                <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                        update("password", e.target.value)
                    }
                />
            )}

            <Select
                label="Role"
                value={form.role}
                onChange={(e) =>
                    update("role", e.target.value)
                }
            >
                <option value="Admin">
                    Administrator
                </option>

                <option value="Manager">
                    Manager
                </option>

                <option value="Staff">
                    Staff
                </option>

                <option value="Viewer">
                    Viewer
                </option>
            </Select>

            <div className={styles.actions}>
                <Button type="submit">
                    {user
                        ? "Save Changes"
                        : "Create User"}
                </Button>
            </div>

        </form>
    );
}