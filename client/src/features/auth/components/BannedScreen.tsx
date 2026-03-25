import React from "react";
import { useAuth } from "../context/AuthContext";
import { ErrorPage } from "@/pages/ErrorPage";

interface BannedScreenProps {
    previewInfo?: { message: string; isBanned?: boolean };
}

const BannedScreen: React.FC<BannedScreenProps> = ({ previewInfo }) => {
    const auth = useAuth();
    
    // Combine context with optional preview props
    const banInfo = previewInfo || auth.banInfo;

    // Only show if we have ban info and (it's a preview OR the user is actually banned)
    if (!banInfo || (!previewInfo && !banInfo.isBanned)) return null;

    return (
        <ErrorPage
            type="403"
            description={banInfo.message}
        />
    );
};

export default BannedScreen;

