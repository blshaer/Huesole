import React, { useState } from "react";
import { NotFoundPage } from "./NotFoundPage";
import BannedScreen from "@/features/auth/components/BannedScreen";
import ErrorPage from "./ErrorPage";
import { Button } from "@/shared/ui/button";

const ErrorPreviewPage: React.FC = () => {
    const [view, setView] = useState<"404" | "403" | "error">("404");

    const renderView = () => {
        switch (view) {
            case "404":
                return <NotFoundPage />;
            case "403":
                return <BannedScreen />;
            case "error":
                return (
                    <ErrorPage
                        error="Something went wrong while fetching gradients. Try again later."
                        onRetry={() => alert("Retrying...")}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black overflow-hidden relative">
            {/* Toolbar for preview selection */}
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-2 p-1 bg-neutral-900/50 border border-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl">
                <Button
                    variant={view === "404" ? "secondary" : "ghost"}
                    onClick={() => setView("404")}
                    className={`h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest ${view === "404" ? "bg-white text-black" : "text-white/50"}`}
                >
                    404 (Not Found)
                </Button>
                <Button
                    variant={view === "403" ? "secondary" : "ghost"}
                    onClick={() => setView("403")}
                    className={`h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest ${view === "403" ? "bg-white text-black" : "text-white/50"}`}
                >
                    403 (Banned)
                </Button>
                <Button
                    variant={view === "error" ? "secondary" : "ghost"}
                    onClick={() => setView("error")}
                    className={`h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest ${view === "error" ? "bg-white text-black" : "text-white/50"}`}
                >
                    Internal Error
                </Button>
            </div>

            <div className="w-full h-full">
                {renderView()}
            </div>
        </div>
    );
};

export default ErrorPreviewPage;
