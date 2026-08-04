import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ProfileSummary from "../components/account/ProfileSummary";
import PersonalInformationCard from "../components/account/PersonalInformationCard";
import Toast from "../components/common/Toast";
import { getCurrentUser, updateProfile } from "../services/userService";
import type { User } from "../models/user";
import ChangePasswordCard from "../components/account/ChangePasswordCard";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");

    const showToast = (
        message: string,
        type: "success" | "error"
    ) => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);

        setTimeout(() => {
            setToastVisible(false);
        }, 3000);
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error(error);
                showToast("Unable to load your profile.", "error");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>User not found.</p>;
    }

    return (
        <>
            <PageHeader
                title="My Profile"
                subtitle="Manage your account information"
            />

            <ProfileSummary
                fullName={user.fullName}
                role={user.role}
            />

            <PersonalInformationCard
                fullName={user.fullName}
                email={user.email}
                role={user.role}
                onSave={async (newName) => {
                    try {
                        const updatedUser = await updateProfile({
                            fullName: newName,
                        });

                        setUser(updatedUser);

                        showToast(
                            "Profile updated successfully.",
                            "success"
                        );
                    } catch (error) {
                        console.error(error);

                        showToast(
                            "Unable to update your profile.",
                            "error"
                        );
                    }
                }}
            />

            <ChangePasswordCard
                onSuccess={(message) =>
                    showToast(message, "success")
                }
                onError={(message) =>
                    showToast(message, "error")
                }
            />

            <Toast
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
            />
        </>
    );
}