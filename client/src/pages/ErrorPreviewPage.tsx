import React, { useState } from "react";
import { ErrorPage, ErrorType } from "./ErrorPage";
import { Button } from "@/shared/ui/button";
import { AnimatePresence } from "framer-motion";

const ErrorPreviewPage: React.FC = () => {
    const [view, setView] = useState<ErrorType>("404");

    const errorTypes: ErrorType[] = ["400", "403", "404", "500", "generic"];

    return (
        <div className="min-h-screen bg-black overflow-hidden relative">
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[250] flex items-center gap-2 p-1 bg-neutral-900/50 border border-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl">
                {errorTypes.map((type) => (
                    <Button
                        key={type}
                        variant={view === type ? "secondary" : "ghost"}
                        onClick={() => setView(type)}
                        className={`h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                            view === type 
                                ? "bg-white text-black shadow-lg shadow-white/10" 
                                : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        }`}
                    >
                        {type === "generic" ? "Internal" : type}
                    </Button>
                ))}
            </div>

            <div className="w-full h-full">
                <AnimatePresence mode="wait">
                    <ErrorPage 
                        key={view} 
                        type={view} 
                        onRetry={view === "generic" || view === "500" ? () => alert("Retrying...") : undefined}
                    />
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ErrorPreviewPage;

