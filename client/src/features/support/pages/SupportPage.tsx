import React, { useState, useEffect } from "react";
import axios from "axios";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/context/AuthContext";

import { API_URL } from "@/shared/config";

const SupportPage: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${API_URL}/support`, formData);
            setIsSuccess(true);
            toast("Message Sent!", { description: "We've received your inquiry and will get back to you soon." });
            setTimeout(() => setIsSuccess(false), 5000);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error: any) {
            toast.error("Error", { description: error.response?.data?.message || "Failed to send message. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 container relative overflow-hidden backdrop-blur-3xl">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 blur-[120px] opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto space-y-12"
            >
                <div className="text-center space-y-4">

                    <h1 className="text-5xl font-bold tracking-tight text-white mb-2">Get in Touch</h1>
                    <p className="text-white/50 text-lg">
                        Have a question, feedback, or need some help with VercelGradients? <br className="hidden md:block" />
                        Our team is here to support you.
                    </p>
                </div>

                <div className="p-8 rounded-[32px] border border-white/5 bg-black/40 backdrop-blur-2xl shadow-2xl relative">
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                            >
                                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Message Received!</h2>
                                <p className="text-white/50 max-w-xs">
                                    Thanks for reaching out! We'll review your message and reply via email shortly.
                                </p>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsSuccess(false)}
                                    className="text-indigo-400 hover:text-indigo-300 hover:bg-white/5"
                                >
                                    Send another message
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-white/70">Name</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-white/70">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-white/70">Subject</Label>
                                    <Input
                                        id="subject"
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="What's this regarding?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-white/70">Message</Label>
                                    <Textarea
                                        id="message"
                                        required
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="How can we help you today?"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-lg font-semibold gap-3 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>


            </motion.div>
        </div>
    );
};

export default SupportPage;
