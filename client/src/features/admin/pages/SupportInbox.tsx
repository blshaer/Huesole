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
import { MoreHorizontal, Trash2, MailOpen, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/shared/ui/dialog";

import { API_URL } from "@/shared/config";

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "new" | "read" | "replied";
    createdAt: string;
}

const SupportInbox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get<{ data: Message[] }>(`${API_URL}/admin/support`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data.data);
        } catch (error) {
            toast.error("Error", { description: "Failed to load messages" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async () => {
        if (!messageToDelete) return;
        setIsDeleting(true);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/admin/support/${messageToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(messages.filter(m => m._id !== messageToDelete._id));
            toast("Deleted", { description: "Message removed" });
            setMessageToDelete(null);
        } catch (error) {
            toast.error("Error", { description: "Failed to delete" });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: "read" | "replied") => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/admin/support/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(messages.map(m => m._id === id ? { ...m, status } : m));
        } catch (error) {
            toast.error("Error", { description: "Failed to update status" });
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
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Support Inbox</h1>
                    <p className="text-white/50 mt-1">Manage and respond to user inquiries.</p>
                </div>
                <Badge className="bg-indigo-500/10 w-max text-indigo-400 border-none px-3 py-1">
                    {messages.filter(m => m.status === "new").length} New Messages
                </Badge>
            </div>

            <div className="rounded-[24px] border border-white/5 bg-black/40 backdrop-blur-3xl overflow-x-auto shadow-2xl custom-scrollbar">
                <Table className="min-w-[800px]">
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="w-[200px] text-white/70 font-bold uppercase text-[10px] tracking-widest pl-6">Sender</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Subject</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest text-right pr-6">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-white/20">No messages found.</TableCell>
                            </TableRow>
                        ) : (
                            messages.map((m) => (
                                <TableRow
                                    key={m._id}
                                    className={cn(
                                        "border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer",
                                        m.status === "new" ? "bg-indigo-500/[0.03]" : ""
                                    )}
                                    onClick={() => handleUpdateStatus(m._id, "read")}
                                >
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{m.name}</span>
                                            <span className="text-xs text-white/40">{m.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-sm",
                                                m.status === "new" ? "text-white font-semibold" : "text-white/70"
                                            )}>{m.subject}</span>
                                            <span className="text-xs text-white/30 truncate max-w-[300px]">{m.message}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "rounded-lg px-2 py-0.5 w-max border-none",
                                            m.status === "new" ? "bg-indigo-500 text-white" :
                                                m.status === "read" ? "bg-white/10 text-white/60" : "bg-emerald-500/10 text-emerald-400"
                                        )}>
                                            {m.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <span className="text-xs text-white/30 flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(m.createdAt).toLocaleDateString()}
                                            </span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-gray-950/95 border-white/10 text-white backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(m._id, "replied")} className="rounded-xl hover:bg-white/10 cursor-pointer gap-2">
                                                        <MailOpen className="h-4 w-4" />
                                                        <span>Mark Replied</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMessageToDelete(m);
                                                        }}
                                                        className="text-red-400 focus:text-red-400 focus:bg-red-500/20 rounded-xl hover:bg-red-500/10 cursor-pointer gap-2"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
                <DialogContent className="bg-gray-950 border-white/10 text-white rounded-3xl backdrop-blur-3xl max-w-sm">
                    <DialogHeader className="space-y-3">

                        <DialogTitle className="text-xl font-bold">Delete Message?</DialogTitle>
                        <DialogDescription className="text-white/50">
                            This action cannot be undone. This will permanently delete the message from <span className="text-white font-medium">{messageToDelete?.name}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-3 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setMessageToDelete(null)}
                            className="flex-1 rounded-xl hover:bg-white/5 border-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SupportInbox;
