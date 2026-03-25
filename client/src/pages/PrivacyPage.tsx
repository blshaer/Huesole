import React from "react";
import { motion } from "framer-motion";

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8 prose prose-invert prose-p:text-white/60 prose-headings:text-white"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-lg">Last modified: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-4">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, generate gradients, or contact us for support.
          </p>
          
          <h2>2. How We Use Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, develop new features, and protect LumeGradients and our users.
          </p>

          <h2>3. Cookies</h2>
          <p>
            We use cookies to maintain your session and remember your preferences. You can control cookie usage through your browser settings.
          </p>

          <h2>4. Data Storage</h2>
          <p>
            Your generated gradients and account information are safely stored in our secure database. We do not sell your personal data to third parties.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
