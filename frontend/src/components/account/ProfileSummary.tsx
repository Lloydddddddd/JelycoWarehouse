import { User } from "lucide-react";
import styles from "./ProfileSummary.module.css";

interface Props {
    fullName: string;
    role: string;
}

const roleLabels: Record<string, string> = {
    Admin: "Administrator",
    Manager: "Manager",
    Staff: "Warehouse Staff",
    Viewer: "Viewer",
};

export default function ProfileSummary({
    fullName,
    role,
}: Props) {
    return (
        <div className={styles.card}>

            <div className={styles.avatar}>
                <User size={42}/>
            </div>

            <h2>{fullName}</h2>

            <p>
                {roleLabels[role] ?? role}
            </p>

        </div>
    );
}