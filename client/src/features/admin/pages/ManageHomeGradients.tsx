import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Plus, Trash2, Edit2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import Pagination from "@/features/landing/components/Pagination";

import { API_URL } from "@/shared/config";

interface Gradient {
    _id: string;
    name: string;
    colors: string[];
    type: string;
    angle?: number;
}

const ManageHomeGradients: React.FC = () => {
    const [gradients, setGradients] = useState<Gradient[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGradients, setTotalGradients] = useState(0);
    const limit = 10;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingGradient, setEditingGradient] = useState<Gradient | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        colors: "",
        type: "linear",
        angle: 90
    });

    const fetchGradients = async () => {
        setLoading(true);
        try {
            const response = await axios.get<{ data: Gradient[], pagination: any }>(`${API_URL}/home-gradients?page=${page}&limit=${limit}`);
            setGradients(response.data.data);
            if (response.data.pagination) {
                setTotalPages(response.data.pagination.pages);
                setTotalGradients(response.data.pagination.total);
            }
        } catch (error) {
            toast.error("Error", { description: "Failed to load gradients" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGradients();
    }, [page]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this gradient?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/admin/home-gradients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGradients(gradients.filter(g => g._id !== id));
            toast("Deleted", { description: "Gradient removed from home page" });
        } catch (error) {
            toast.error("Error", { description: "Failed to delete" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const data = {
            ...formData,
            colors: formData.colors.split(",").map(c => c.trim())
        };

        try {
            if (editingGradient) {
                await axios.put(`${API_URL}/admin/home-gradients/${editingGradient._id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast("Updated", { description: "Gradient updated successfully" });
            } else {
                await axios.post(`${API_URL}/admin/home-gradients`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast("Created", { description: "Gradient added successfully" });
            }
            fetchGradients();
            setIsDialogOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error("Error", { description: error.response?.data?.message || "Operation failed" });
        }
    };

    const resetForm = () => {
        setFormData({ name: "", colors: "", type: "linear", angle: 90 });
        setEditingGradient(null);
    };

    const openEdit = (g: Gradient) => {
        setEditingGradient(g);
        setFormData({
            name: g.name,
            colors: g.colors.join(", "),
            type: g.type,
            angle: g.angle || 90
        });
        setIsDialogOpen(true);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Home Gradients</h1>
                    <p className="text-white/50 mt-1">Manage the curated gradients shown to all users.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl gap-2"
                >
                    <Plus size={18} />
                    Add Gradient
                </Button>
            </div>

            <div className="rounded-[24px] border border-white/5 bg-black/40 backdrop-blur-3xl overflow-x-auto shadow-2xl custom-scrollbar">
                <Table className="min-w-[600px]">
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="w-[100px] text-white/70 font-bold uppercase text-[10px] tracking-widest pl-6">Preview</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Name</TableHead>
                            <TableHead className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Colors</TableHead>
                            <TableHead className="text-right pr-6 text-white/70 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gradients.map((g) => (
                            <TableRow key={g._id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <TableCell className="pl-6 py-4">
                                    <div
                                        className="h-10 w-10 rounded-lg shadow-lg"
                                        style={{ background: `linear-gradient(${g.angle || 90}deg, ${g.colors.join(", ")})` }}
                                    />
                                </TableCell>
                                <TableCell className="font-medium text-white">{g.name}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        {g.colors.map((c, i) => (
                                            <div key={i} className="h-4 w-4 rounded-full border border-white/10" style={{ background: c }} />
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(g)} className="hover:bg-white/10 text-white/50 hover:text-white">
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(g._id)} className="hover:bg-red-500/10 text-white/50 hover:text-red-400">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between px-2 pt-8 gap-4">
                <div className="text-sm text-white/40 font-medium order-2 md:order-1">
                    Showing <span className="text-white">{(page - 1) * limit + 1}</span> to <span className="text-white">{Math.min(page * limit, totalGradients)}</span> of <span className="text-white">{totalGradients}</span> gradients
                </div>
                <div className="order-1 md:order-2">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(p) => setPage(p)}
                        isLoading={false}
                    />
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-gray-950 border-white/10 text-white rounded-3xl backdrop-blur-3xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="text-indigo-500" size={20} />
                            {editingGradient ? "Edit Gradient" : "New Home Gradient"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Gradient Name</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="bg-white/5 border-white/10"
                                placeholder="E.g. Blue Lagoon"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Colors (Comma separated)</Label>
                            <Input
                                value={formData.colors}
                                onChange={e => setFormData({ ...formData, colors: e.target.value })}
                                className="bg-white/5 border-white/10"
                                placeholder="#000000, #ffffff"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 ring-indigo-500"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="linear">Linear</option>
                                    <option value="radial">Radial</option>
                                    <option value="conic">Conic</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Angle (deg)</Label>
                                <Input
                                    type="number"
                                    value={formData.angle}
                                    onChange={e => setFormData({ ...formData, angle: parseInt(e.target.value) })}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">
                                {editingGradient ? "Save Changes" : "Create Gradient"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageHomeGradients;
