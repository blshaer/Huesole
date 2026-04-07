import React, { useEffect, useState } from "react";
import { Sparkles, UserPlus, Users, Mail, Palette, ArrowUpRight, Activity } from "lucide-react";
import axios from "axios";
import { MagicCard } from "@/shared/ui/MagicCard";
import { useTheme } from "next-themes";
import { VercelSpinner } from "@/shared/ui/VercelSpinner";
import { cn } from "@/shared/lib/utils";

import { API_URL } from "@/shared/config";

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
            icon: Users,
            color: "indigo",
            description: "Registered account holders",
            trend: "+12%"
        },
        {
            label: "Support Inbox",
            value: stats.messages,
            icon: Mail,
            color: "emerald",
            description: "Pending support requests",
            trend: "5 active"
        },
        {
            label: "Gradients",
            value: stats.gradients,
            icon: Palette,
            color: "pink",
            description: "Curated home collection",
            trend: "Live"
        },
    ];

    const { theme } = useTheme();

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <VercelSpinner size={80} />
                <p className="text-sm font-medium text-white/40 animate-pulse">Synchronizing dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
                    <Activity size={14} />
                    System Status: Operational
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white">Admin Overview</h1>
                <p className="mt-1 text-white/45 text-lg">Monitor your system performance and management tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <MagicCard
                            gradientColor={theme === "dark" ? "#262626" : "#e5e7eb"}
                            key={card.label}
                            className="relative overflow-hidden border border-white/10 group rounded-[32px] bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-white/20"
                        >
                            <div className="flex flex-col h-full justify-between gap-6">
                                <div className="flex items-start justify-between">
                                    <div className={cn(
                                        "p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500",
                                        `text-${card.color}-400`
                                    )}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 group-hover:text-white/70 transition-colors uppercase tracking-wider">
                                        <ArrowUpRight size={10} />
                                        {card.trend}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white/40 uppercase tracking-widest">{card.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-5xl font-bold text-white tracking-tighter tabular-nums">
                                            {card.value}
                                        </h2>
                                    </div>
                                    <p className="text-xs text-white/20 font-medium pt-1">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative background flare */}
                            <div className={cn(
                                "absolute -right-20 -bottom-20 h-64 w-64 rounded-full blur-[100px] transition-all duration-700 opacity-20 group-hover:opacity-30",
                                card.color === "indigo" ? "bg-indigo-500" : 
                                card.color === "emerald" ? "bg-emerald-500" : "bg-pink-500"
                            )} />
                        </MagicCard>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-3xl overflow-hidden relative group">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="text-indigo-400" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="flex items-center gap-4 p-5 rounded-[20px] bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group/btn">
                                <div className="p-3 rounded-xl bg-white/5 text-white/70 group-hover/btn:text-white group-hover/btn:bg-white/10 transition-all shadow-inner">
                                    <UserPlus size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold">Add User</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-wider">Manual onboarding</div>
                                </div>
                            </button>
                            <button className="flex items-center gap-4 p-5 rounded-[20px] bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group/btn">
                                <div className="p-3 rounded-xl bg-white/5 text-white/70 group-hover/btn:text-white group-hover/btn:bg-white/10 transition-all shadow-inner">
                                    <Sparkles size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold">New Gradient</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-wider">Gallery curation</div>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    {/* Background blob */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700" />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
