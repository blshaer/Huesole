import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Trash2, Loader2, Ban, UserCheck, MessageSquare, Heart, Sparkles, Clock, Mail, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { getFullImageUrl } from "@/shared/utils/imageUrl";
import { toast } from "@/shared/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/shared/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

const BASE_URL = import.meta.env.VITE_API_URL || "";
const API_URL = `${BASE_URL}/api`;

interface User {
    _id: string;
    name: string;
    email: string;
    picture?: string;
    favorites: string[];
    createdGradients: any[];
    supportMessagesCount: number;
    isBanned: boolean;
    banMessage?: string;
    createdAt: string;
}

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userMessages, setUserMessages] = useState<any[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("favorites");

    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
    const [userToBan, setUserToBan] = useState<User | null>(null);
    const [banMessage, setBanMessage] = useState("");
    const [isBanning, setIsBanning] = useState(false);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get<{ data: User[] }>(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load users",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchUserMessages = async (email: string) => {
        setLoadingMessages(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get<{ data: any[] }>(`${API_URL}/admin/users/${email}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserMessages(response.data.data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load user messages", variant: "destructive" });
        } finally {
            setLoadingMessages(false);
        }
    };

    const openUserDetails = (user: User, tab: string) => {
        setSelectedUser(user);
        setActiveTab(tab);
        if (tab === "messages") {
            fetchUserMessages(user.email);
        }
    };

    const handleBanUser = async () => {
        if (!userToBan) return;
        setIsBanning(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/admin/users/${userToBan._id}/ban`, {
                isBanned: true,
                banMessage: banMessage
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "User Banned", description: `${userToBan.name} has been banned.` });
            setUsers(users.map(u => u._id === userToBan._id ? { ...u, isBanned: true, banMessage } : u));
            setIsBanDialogOpen(false);
            setBanMessage("");
            setUserToBan(null);
        } catch (error) {
            toast({ title: "Error", description: "Failed to ban user", variant: "destructive" });
        } finally {
            setIsBanning(false);
        }
    };

    const handleUnbanUser = async (user: User) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/admin/users/${user._id}/ban`, {
                isBanned: false
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "User Unbanned", description: `${user.name} has been unbanned.` });
            setUsers(users.map(u => u._id === user._id ? { ...u, isBanned: false, banMessage: "" } : u));
        } catch (error) {
            toast({ title: "Error", description: "Failed to unban user", variant: "destructive" });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({ title: "Success", description: "User deleted successfully" });
            setUsers(users.filter(u => u._id !== id));
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete user",
                variant: "destructive",
            });
        }
    };


    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Manage Users</h1>
                <p className="text-white/50 mt-1">Full control over user accounts and permissions.</p>
            </div>

            <div className="rounded-[24px] border border-white/5 bg-black/40 backdrop-blur-3xl overflow-x-auto shadow-2xl custom-scrollbar">
                <Table className="min-w-[700px]">
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="w-[100px] text-white/70 font-bold uppercase text-[10px] tracking-widest pl-6">User</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Email</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest text-center">Favorites</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest text-center">Gradients</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest text-center">Support</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Joined</TableHead>
                            <TableHead className="text-right pr-6 text-white/70 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-indigo-500/0 group-hover:ring-indigo-500/20 transition-all">
                                            <AvatarImage src={getFullImageUrl(user.picture)} alt={user.name} />
                                            <AvatarFallback className="bg-white/5 text-white/50">{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                                            {user.name}
                                            {user.isBanned && (
                                                <Badge className="bg-red-500/10 text-red-500 border-none px-1.5 py-0 text-[9px] uppercase font-bold">Banned</Badge>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-white/60 font-mono text-sm">{user.email}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => openUserDetails(user, "favorites")}
                                            className="h-7 px-3 rounded-full bg-pink-500/10 text-pink-500 text-xs flex items-center justify-center font-bold gap-1.5 hover:bg-pink-500/20 transition-all border border-pink-500/20"
                                        >
                                            <Heart size={12} fill="currentColor" />
                                            {user.favorites?.length || 0}
                                        </button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => openUserDetails(user, "gradients")}
                                            className="h-7 px-3 rounded-full bg-indigo-500/10 text-indigo-500 text-xs flex items-center justify-center font-bold gap-1.5 hover:bg-indigo-500/20 transition-all border border-indigo-500/20"
                                        >
                                            <Sparkles size={12} />
                                            {user.createdGradients?.length || 0}
                                        </button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => openUserDetails(user, "messages")}
                                            className="h-7 px-3 rounded-full bg-emerald-500/10 text-emerald-500 text-xs flex items-center justify-center font-bold gap-1.5 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                                        >
                                            <MessageSquare size={12} />
                                            {user.supportMessagesCount || 0}
                                        </button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-white/40 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-gray-950/95 border-white/10 text-white backdrop-blur-xl rounded-2xl p-2 w-48 shadow-2xl">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    if (user.isBanned) {
                                                        handleUnbanUser(user);
                                                    } else {
                                                        setUserToBan(user);
                                                        setIsBanDialogOpen(true);
                                                    }
                                                }}
                                                className={cn(
                                                    "rounded-xl hover:bg-white/10 cursor-pointer gap-2",
                                                    user.isBanned ? "text-emerald-400 focus:text-emerald-400" : "text-orange-400 focus:text-orange-400"
                                                )}
                                            >
                                                {user.isBanned ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                                <span>{user.isBanned ? "Unban User" : "Ban User"}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteUser(user._id, user.name)}
                                                className="text-red-400 focus:text-red-400 focus:bg-red-500/20 rounded-xl hover:bg-red-500/10 cursor-pointer gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>Delete User</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="bg-gray-950/90 border-white/10 text-white rounded-[32px] backdrop-blur-3xl max-w-2xl p-0 overflow-hidden shadow-2xl">
                    {selectedUser && (
                        <div className="flex flex-col h-[600px]">
                            <DialogHeader className="p-8 pb-4 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-indigo-500/20 ring-4 ring-indigo-500/5">
                                        <AvatarImage src={getFullImageUrl(selectedUser.picture)} />
                                        <AvatarFallback className="bg-white/5 text-2xl text-white/50">{selectedUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <DialogTitle className="text-2xl font-bold">{selectedUser.name}</DialogTitle>
                                        <p className="text-white/40 flex items-center gap-1.5 mt-0.5">
                                            <Mail size={14} />
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                </div>
                            </DialogHeader>

                            <Tabs value={activeTab} onValueChange={(val) => {
                                setActiveTab(val);
                                if (val === "messages") fetchUserMessages(selectedUser.email);
                            }} className="flex-1 flex flex-col">
                                <TabsList className="bg-transparent border-b border-white/5 p-0 h-14 w-full justify-start px-8 gap-8 rounded-none">
                                    <TabsTrigger value="favorites" className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:border-b-2 border-pink-500 rounded-none px-0 h-14 bg-transparent text-white/40 font-bold uppercase text-[10px] tracking-widest transition-all">
                                        Favorites ({selectedUser.favorites?.length || 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="gradients" className="data-[state=active]:bg-transparent data-[state=active]:text-indigo-500 data-[state=active]:border-b-2 border-indigo-500 rounded-none px-0 h-14 bg-transparent text-white/40 font-bold uppercase text-[10px] tracking-widest transition-all">
                                        Gradients ({selectedUser.createdGradients?.length || 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="messages" className="data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 data-[state=active]:border-b-2 border-emerald-500 rounded-none px-0 h-14 bg-transparent text-white/40 font-bold uppercase text-[10px] tracking-widest transition-all">
                                        Support ({selectedUser.supportMessagesCount || 0})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="favorites" className="flex-1 p-8 m-0 relative overflow-hidden">
                                    <ScrollArea className="h-[380px] pr-4">
                                        {selectedUser.favorites?.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-white/20 pt-20">
                                                <Heart size={40} className="mb-2 opacity-10" />
                                                <p>No favorites yet</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                {selectedUser.favorites?.map((id) => (
                                                    <div key={id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                                                        <span className="text-white/60 font-mono text-xs truncate mr-2">{id}</span>
                                                        <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="gradients" className="flex-1 p-8 m-0 overflow-hidden">
                                    <ScrollArea className="h-[380px] pr-4">
                                        {selectedUser.createdGradients?.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-white/20 pt-20">
                                                <Sparkles size={40} className="mb-2 opacity-10" />
                                                <p>No gradients created</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {selectedUser.createdGradients?.map((g) => (
                                                    <div key={g.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/[0.08] transition-all">
                                                        <div
                                                            className="h-12 w-12 rounded-xl border border-white/10 shadow-lg"
                                                            style={{ background: `linear-gradient(${g.angle || 90}deg, ${g.colors.join(", ")})` }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{g.name}</div>
                                                            <div className="text-[10px] text-white/30 font-mono flex gap-1 mt-1">
                                                                {g.colors.map((c: string) => <span key={c}>{c}</span>)}
                                                            </div>
                                                        </div>
                                                        <div className="text-[10px] text-white/20 flex items-center gap-1 group-hover:text-white/40">
                                                            <Clock size={10} />
                                                            {new Date(g.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="messages" className="flex-1 p-0 m-0 overflow-hidden">
                                    <ScrollArea className="h-[380px]">
                                        {loadingMessages ? (
                                            <div className="flex h-[300px] items-center justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                                            </div>
                                        ) : userMessages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-white/20 pt-20">
                                                <MessageSquare size={40} className="mb-2 opacity-10" />
                                                <p>No messages found</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-white/5">
                                                {userMessages.map((m) => (
                                                    <div key={m._id} className="p-6 hover:bg-white/[0.02] transition-colors group">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{m.subject}</div>
                                                            <div className="text-[10px] text-white/20 flex items-center gap-1">
                                                                <Clock size={10} />
                                                                {new Date(m.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-white/50 leading-relaxed">{m.message}</p>
                                                        <div className="mt-4">
                                                            <span className={cn(
                                                                "text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md",
                                                                m.status === "new" ? "bg-indigo-500 text-white" :
                                                                    m.status === "read" ? "bg-white/10 text-white/40" : "bg-emerald-500/10 text-emerald-400"
                                                            )}>
                                                                {m.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
                <DialogContent className="bg-gray-950/95 border-white/10 text-white rounded-[32px] backdrop-blur-3xl max-w-md p-8 shadow-2xl">
                    <DialogHeader>
                        <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                            <Ban size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold">Ban User</DialogTitle>
                        <DialogDescription className="text-white/40 pt-2">
                            You are about to ban <span className="text-white font-semibold">{userToBan?.name}</span>. This will prevent them from accessing their account.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-white/40">Ban Reason</label>
                            <textarea
                                value={banMessage}
                                onChange={(e) => setBanMessage(e.target.value)}
                                placeholder="Enter the reason for the ban (this will be shown to the user)"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white min-h-[120px] outline-none focus:ring-2 ring-red-500/50 transition-all resize-none text-sm"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setIsBanDialogOpen(false)}
                            className="flex-1 rounded-2xl hover:bg-white/5 border-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBanUser}
                            disabled={!banMessage || isBanning}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
                        >
                            {isBanning ? <Loader2 className="animate-spin" /> : "Ban User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageUsers;
