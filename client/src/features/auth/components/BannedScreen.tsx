import React from "react";
import { Ban, LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";

const BannedScreen: React.FC = () => {
    const { banInfo, logout } = useAuth();

    if (!banInfo) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl overflow-hidden px-4">
            {/* Decorative background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-xl w-full bg-white/[0.03] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
                {/* Border glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="h-20 w-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-8 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <Ban size={40} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-red-400 to-indigo-400 bg-clip-text text-transparent mb-4 tracking-tight">
                        Account Restricted
                    </h1>

                    <div className="space-y-6">
                        <p className="text-white/40 text-sm md:text-base leading-relaxed">
                            Your access to GradlyAI has been suspended by an administrator. Please review the reason below:
                        </p>

                        <div className="bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-6 relative">
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-red-400">
                                Admin Message
                            </div>
                            <p className="text-red-400/90 font-medium italic select-none">
                                "{banInfo.message}"
                            </p>
                        </div>

                        <p className="text-white/20 text-xs">
                            If you believe this is a mistake, please reach out to our support team.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full mt-10">
                        <Button
                            onClick={logout}
                            variant="ghost"
                            className="flex-1 h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold gap-2 border-white/5"
                        >
                            <LogOut size={18} />
                            Log Out
                        </Button>
                        <Button
                            asChild
                            className="flex-1 h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                        >
                            <a href="mailto:support@gradlyai.com">
                                <MessageCircle size={18} />
                                Contact Support
                            </a>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BannedScreen;
