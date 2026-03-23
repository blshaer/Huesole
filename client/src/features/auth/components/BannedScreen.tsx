import React from "react";
import { useAuth } from "../context/AuthContext";
import { BaseErrorLayout } from "@/shared/components/BaseErrorLayout";

const BannedScreen: React.FC = () => {
    const { banInfo, logout } = useAuth();

    if (!banInfo) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <BaseErrorLayout
                title="403 Access Forbidden"
                description={banInfo.message || "Your access to GradlyAI has been suspended. Please contact support if you believe this is a mistake."}
                actionText="Log Out"
                onAction={logout}
            />
        </div>
    );
};

export default BannedScreen;
