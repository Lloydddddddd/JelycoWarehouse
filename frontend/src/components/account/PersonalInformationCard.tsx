import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import styles from "./PersonalInformationCard.module.css";

interface Props {
    fullName: string;
    email: string;
    role: string;
    onSave?: (fullName: string) => Promise<void>;
}

const roleLabels: Record<string, string> = {
    Admin: "Administrator",
    Manager: "Manager",
    Staff: "Warehouse Staff",
    Viewer: "Viewer",
};

export default function PersonalInformationCard({
    fullName,
    email,
    role,
    onSave,
}: Props) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(fullName);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setName(fullName);
    }, [fullName]);

    const handleSave = async () => {
        const trimmed = name.trim();

        if (trimmed.length < 3) {
            alert("Full name must be at least 3 characters.");
            return;
        }

        try {
            setSaving(true);

            await onSave?.(trimmed);

            setEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setName(fullName);
        setEditing(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>Personal Information</h3>
                <p>View and update your account details.</p>
            </div>

            <div className={styles.form}>
                <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editing || saving}
                />

                <Input
                    label="Email"
                    value={email}
                    disabled
                />

                <Input
                    label="Role"
                    value={roleLabels[role] ?? role}
                    disabled
                />
            </div>

            <div className={styles.actions}>
                {!editing ? (
                    <Button
                        onClick={() => setEditing(true)}
                    >
                        Edit Profile
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}