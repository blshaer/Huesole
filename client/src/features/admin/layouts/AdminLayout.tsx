import { useAuth } from "@/features/auth/context/AuthContext";
import { cn } from "@/shared/lib/utils";
import Logo from "@/shared/ui/Logo";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

const AdminLayout: React.FC = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    const navItems = [
        {
            label: "Overview",
            href: "/admin",
        },
        {
            label: "Manage Users",
            href: "/admin/users",
        },
        {
            label: "Home Gradients",
            href: "/admin/gradients",
        },
        {
            label: "Support Messages",
            href: "/admin/support",
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#050505] text-white">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-full w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl lg:block hidden">
                <div className="flex h-full flex-col p-6 border-r border-white/20">
                    <div className="mb-10 flex items-center gap-3 px-2">
                        <Logo />
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                                        isActive
                                            ? "bg-indigo-500/10 text-indigo-400"
                                            : "text-white/50 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.label}
                                    </div>
                                    {isActive && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-6">
                        <Link
                            to="/"
                            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                        >
                            <span>Back to Site</span>
                            <ChevronRight size={14} className="ml-auto" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64">
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
