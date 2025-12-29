import React, { useEffect, useState } from "react";
import { Sparkles, UserPlus } from "lucide-react";
import axios from "axios";
import { MagicCard } from "@/shared/ui/MagicCard";
import { useTheme } from "next-themes";

const BASE_URL = import.meta.env.VITE_API_URL || "";
const API_URL = `${BASE_URL}/api`;

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        users: 0,
        messages: 0,
        gradients: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const [usersRes, messagesRes, gradientsRes] = await Promise.all([
                    axios.get<{ data: any[] }>(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get<{ data: any[] }>(`${API_URL}/admin/support`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get<{ data: any[] }>(`${API_URL}/home-gradients`),
                ]);

                setStats({
                    users: usersRes.data.data.length,
                    messages: messagesRes.data.data.length,
                    gradients: gradientsRes.data.data.length,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            label: "Total Users",
            value: stats.users,
            color: "indigo",
            increased: "+12%",
        },
        {
            label: "Support Inbox",
            value: stats.messages,
            color: "emerald",
            increased: "5 pending",
        },
        {
            label: "Landing Gradients",
            value: stats.gradients,
            color: "amber",
            increased: "Active",
        },
    ];



    const { theme } = useTheme();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
                <p className=" mt-1">Monitor your system performance and management tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <MagicCard

                        gradientColor={theme === "dark" ? "#262626" : "#282828"}

                        key={card.label}
                        className="relative overflow-hidden border border-white/20 group rounded-3xl border  bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04]"
                    >

                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-white/50">{card.label}</h3>
                            <p className="text-3xl font-bold mt-1 text-white/70">
                                {loading ? "..." : card.value}
                            </p>
                        </div>

                        {/* Decorative background flare */}
                        <div className={`absolute -right-10 -bottom-10 h-32 w-32 rounded-full blur-[80px] bg-${card.color}-500/20 group-hover:bg-${card.color}-500/30 transition-all`} />
                    </MagicCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-3xl border border-white/20 bg-white/[0.02] p-8">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all gap-3 border border-white/5">
                            <UserPlus className="text-white" />
                            <span className="text-sm">Add User</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all gap-3 border border-white/5">
                            <Sparkles className="text-white" />
                            <span className="text-sm">New Gradient</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
