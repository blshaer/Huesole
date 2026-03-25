import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/context/AuthContext";
import { API_URL } from "@/shared/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "User",
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
    if (formData.message.length < 10) {
      toast.error("Message too short", { description: "Message must be at least 10 characters." });
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/support`, formData);
      setIsSuccess(true);
      toast.success("Message Sent!", { description: "We've received your inquiry and will get back to you soon." });
      setFormData(prev => ({ ...prev, subject: "", message: "" }));
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      toast.error("Error", { description: error.response?.data?.message || "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">Contact Us</h1>
          <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 text-center space-y-6 bg-neutral-900/40 rounded-3xl border border-white/5 backdrop-blur-xl"
            >
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Message Sent!</h2>
                <p className="text-white/50 max-w-xs mx-auto text-sm">
                  Thanks for reaching out! We've received your message and will get back to you as soon as possible.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsSuccess(false)}
                className="text-white hover:bg-white/5 text-xs font-bold uppercase tracking-widest"
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
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-white/90">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="h-12 bg-neutral-900/50 border-white/10 text-white placeholder:text-white/40 focus:ring-1 focus:ring-white/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-semibold text-white/90">Subject</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(val) => setFormData({...formData, subject: val})}
                  required
                >
                  <SelectTrigger className="h-12 bg-neutral-900/50 border-white/10 text-white focus:ring-1 focus:ring-white/20 transition-all">
                    <SelectValue placeholder="Select a subject" className="placeholder:text-white/40" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-white/10 text-white">
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="account">Account Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold text-white/90">
                  Message*
                </Label>
                <div className="relative">
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message (required, min. 10 characters)"
                    className="min-h-[180px] bg-neutral-900/50 border-white/10 text-white placeholder:text-white/40 focus:ring-1 focus:ring-white/20 transition-all resize-none p-4"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="ghost"
                disabled={isSubmitting}
                className="w-full h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md font-semibold transition-all shadow-lg active:scale-[0.98] rounded-xl uppercase tracking-widest text-[11px]"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  "Send Message"
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ContactPage;
