import React from "react";
import { motion } from "framer-motion";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8 prose prose-invert prose-p:text-white/60 prose-headings:text-white"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">Terms of Use</h1>
          <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
            By using LumeGradients, you agree to the following terms and conditions.
          </p>
        </div>

        <section className="space-y-4">
          <h2>1. Use of Service</h2>
          <p>
            LumeGradients provides tools for generating and exploring CSS gradients. You agree to use this service only for lawful purposes and in accordance with these Terms.
          </p>

          <h2>2. Intellectual Property</h2>
          <p>
            The gradients you generate using our tools are yours to use for personal or commercial projects. However, the software, design, and original platform code remain our intellectual property.
          </p>

          <h2>3. Prohibited Conduct</h2>
          <p>
            Users are prohibited from attempting to bypass any security measures, scrap the website, or use the service for any purpose other than intended.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            LumeGradients is provided "as is". We are not responsible for any direct or indirect damages resulting from your use of the service.
          </p>

          <h2>5. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the service constitutes acceptance of any changes.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default TermsPage;
