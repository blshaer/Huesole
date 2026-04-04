import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "@/shared/lib/axios";
import { Loader2 } from "lucide-react";

const PrivacyPage: React.FC = () => {
  const [data, setData] = useState<{ title: string; description: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get<{ data: { title: string; description: string; content: string } }>("/pages/privacy");
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch Privacy:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const title = data?.title || "Privacy Policy";
  const content = data?.content || `
    <h2>1. Information We Collect</h2>
    <p>We collect information you provide directly to us, such as when you create an account, generate gradients, or contact us.</p>
    <h2>2. How We Use Information</h2>
    <p>We use the information we collect to provide and improve our services.</p>
  `;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8 prose prose-invert prose-p:text-white/60 prose-headings:text-white"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
            {data?.description || "Your privacy is important to us. Learn how we handle your data."}
          </p>
        </div>

        <section className="space-y-4" dangerouslySetInnerHTML={{ __html: content }} />
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
