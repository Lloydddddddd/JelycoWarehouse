import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import ProfileSummary from "../components/account/ProfileSummary";
import PersonalInformationCard from "../components/account/PersonalInformationCard";
import Toast from "../components/common/Toast";
import ChangePasswordCard from "../components/account/ChangePasswordCard";

import { updateProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
    const { user, loading, refreshUser } = useAuth();

    const [toastVisible, setToastVisible] =
        useState(false);

    const [toastMessage, setToastMessage] =
        useState("");

    const [toastType, setToastType] =
        useState<"success" | "error">("success");


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
        if (!loading && window.location.hash === "#security") {
            setTimeout(() => {
                document
                    .getElementById("security")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
            }, 100);
        }
    }, [loading]);


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
                        await updateProfile({
                            fullName: newName,
                        });


                        // Refresh global user state
                        await refreshUser();


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