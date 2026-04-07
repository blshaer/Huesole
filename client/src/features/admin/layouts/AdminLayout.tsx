import { useAuth } from "@/features/auth/context/AuthContext";
import { cn } from "@/shared/lib/utils";
import Logo from "@/shared/ui/Logo";
import { VercelSpinner } from "@/shared/ui/VercelSpinner";
import { ChevronRight, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

const AdminLayout: React.FC = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#050505]">
                <VercelSpinner size={64} />
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
            label: "Support Messages",
            href: "/admin/support",
        },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-[#050505] text-white">
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-black/90 px-4 py-3 backdrop-blur-xl lg:hidden">
                <Logo />
                <button
                    onClick={toggleMobileMenu}
                    className="rounded-lg p-2 text-white transition-colors hover:bg-white/10"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full w-64 border-r border-white/10 bg-black/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:bg-black/40",
                    "lg:z-30 lg:translate-x-0",
                    isMobileMenuOpen ? "z-50 translate-x-0" : "z-50 -translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex h-full flex-col p-6">
                    {/* Logo - Hidden on mobile since it's in header */}
                    <div className="mb-10  items-center t gap-3 px-2 lg:flex">
                        <Logo />
                    </div>


                    <nav className="flex-1 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                                        isActive
                                            ? "bg-indigo-500/10 text-indigo-400 border border-white/5"
                                            : "text-white/70 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.label}
                                    </div>
                                    {isActive && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-6">
                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                        >
                            <span>Back to Site</span>
                            <ChevronRight size={14} className="ml-auto" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="w-full pt-16 lg:ml-64 lg:pt-0">
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
