import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "@/shared/lib/axios";
import { Loader2 } from "lucide-react";

const TermsPage: React.FC = () => {
  const [data, setData] = useState<{ title: string; description: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get<{ data: { title: string; description: string; content: string } }>("/pages/terms");
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch Terms:", error);
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

  // Fallback content if backend is empty
  const title = data?.title || "Terms of Use";
  const content = data?.content || `
    <h2>1. Use of Service</h2>
    <p>LumeGradients provides tools for generating and exploring CSS gradients. You agree to use this service only for lawful purposes.</p>
    <h2>2. Intellectual Property</h2>
    <p>The gradients you generate using our tools are yours to use for personal or commercial projects. However, the software and original platform code remain our intellectual property.</p>
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
            {data?.description || "By using LumeGradients, you agree to the following terms and conditions."}
          </p>
        </div>

        <section className="space-y-4" dangerouslySetInnerHTML={{ __html: content }} />
      </motion.div>
    </div>
  );
};

export default TermsPage;
