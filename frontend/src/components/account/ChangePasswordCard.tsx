import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import styles from "./ChangePasswordCard.module.css";
import { changePassword } from "../../services/userService";

interface Props {
    onSuccess(message: string): void;
    onError(message: string): void;
}

export default function ChangePasswordCard({
    onSuccess,
    onError,
}: Props) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const clearForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleSubmit = async () => {
        if (saving) {
            return;
        }

        const current = currentPassword.trim();
        const next = newPassword.trim();
        const confirm = confirmPassword.trim();

        if (!current || !next || !confirm) {
            onError("Please complete all fields.");
            return;
        }

        if (current === next) {
            onError(
                "Your new password must be different from your current password."
            );
            return;
        }

        if (next !== confirm) {
            onError("New passwords do not match.");
            return;
        }

        setSaving(true);

        try {
            await changePassword({
                currentPassword: current,
                newPassword: next,
            });

            clearForm();

            onSuccess("Password changed successfully.");
        } catch (error) {
            if (error instanceof Error) {
                onError(error.message);
            } else {
                onError("Unable to change password.");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>Security</h3>
                <p>Change your account password.</p>
            </div>

            <div className={styles.form}>
                <Input
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(e.target.value)
                    }
                />

                <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(e.target.value)
                    }
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                />
            </div>

            <div className={styles.actions}>
                <Button
                    onClick={handleSubmit}
                    disabled={saving}
                >
                    {saving
                        ? "Changing..."
                        : "Change Password"}
                </Button>
            </div>
        </div>
    );
}