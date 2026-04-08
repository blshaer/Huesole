import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VercelSpinner } from "@/shared/ui/VercelSpinner";

const TermsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <VercelSpinner size={40} />
      </div>
    );
  }

  const sections = [
    {
      title: "1. Agreement to Terms",
      content: "Welcome to Grabient. These Terms of Service (\"Terms\") govern your access to and use of the Grabient website at grabient.com (the \"Service\") operated by Grabient (\"we,\" \"us,\" or \"our\").\n\nBy accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service."
    },
    {
      title: "2. Description of Service",
      content: "Grabient is a web-based CSS gradient generator and palette management tool. Our Service allows you to:\n\n• Generate color gradients using the cosine gradient technique by Inigo Quilez\n• Create, save, and manage gradient palettes\n• Export gradients in various formats (CSS, SVG, PNG)\n• Browse and like gradients created by other users\n• Customize gradient parameters (style, angle, steps)"
    },
    {
      title: "3. User Accounts",
      content: "3.1 Account Creation\nSome features of our Service require you to create an account. You may create an account using:\n• Email authentication (magic link)\n• Google OAuth sign-in\n\n3.2 Account Responsibilities\nYou are responsible for maintaining the security of your account and for all activities that occur under your account.\n\n3.3 Account Termination\nYou may delete your account at any time through your account settings. Account deletion is permanent and will remove your personal data. We may also terminate or suspend your account if you violate these Terms."
    },
    {
      title: "4. User Content",
      content: "4.1 Your Content\nWhen you create and save gradient palettes on our Service, you retain ownership of your creative choices. However, by saving palettes to our Service, you grant us a non-exclusive, worldwide, royalty-free license to store, display, and make your public palettes available to other users of the Service.\n\n4.2 Public Content\nGradient palettes saved on Grabient are publicly visible and may be viewed, liked, and used by other users. You understand that your saved palettes may appear in public galleries and be accessible to anyone using the Service.\n\n4.3 Content Standards\nWhile gradient palettes are mathematical color representations, any associated content (such as usernames or profile images) must not:\n• Violate any applicable law or regulation\n• Infringe on intellectual property rights\n• Contain offensive, harmful, or inappropriate material\n• Impersonate another person or entity"
    },
    {
      title: "5. Acceptable Use",
      content: "You agree not to use the Service to:\n• Violate any laws, regulations, or third-party rights\n• Attempt to gain unauthorized access to our systems or user accounts\n• Interfere with or disrupt the Service or servers\n• Use automated systems (bots, scrapers) to access the Service without permission\n• Circumvent rate limiting or security measures\n• Transmit malware, viruses, or harmful code\n• Engage in any activity that could damage, disable, or impair the Service\n• Use the Service for any fraudulent or deceptive purpose"
    },
    {
      title: "6. Rate Limiting",
      content: "To ensure fair usage and protect our Service, we implement rate limiting on various actions. Exceeding these limits may result in temporary restrictions on your access. Continued abuse may result in account suspension."
    },
    {
      title: "7. Your Use of Gradients",
      content: "Gradients you generate or export from Grabient may be used freely in your personal and commercial projects. You are granted a perpetual, royalty-free license to use any gradient output (CSS, SVG, PNG) for any lawful purpose."
    },
    {
      title: "8. Cookies and Consent",
      content: "We use cookies and similar technologies to operate our Service, analyze usage, and serve personalized advertising. We use Cloudflare Zaraz to manage third-party tools and consent in compliance with applicable privacy laws.\n\nBy using our Service, you acknowledge that:\n• Default consent settings vary by your geographic location (GDPR regions require opt-in; other regions use opt-out)\n• Your consent preferences are stored and honored across sessions\n• You can change your privacy preferences at any time in your account settings\n\nFor full details about our cookie practices, please see our Privacy Policy."
    },
    {
      title: "9. Third-Party Links and Services",
      content: "Our Service may contain links to third-party websites or services (such as Google for authentication). We are not responsible for the content, privacy policies, or practices of any third-party sites or services. Your use of third-party services is governed by their respective terms and policies."
    },
    {
      title: "10. Disclaimer of Warranties",
      content: "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:\n\n• IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT\n• WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE\n• WARRANTIES REGARDING THE ACCURACY OR RELIABILITY OF ANY CONTENT"
    },
    {
      title: "11. Limitation of Liability",
      content: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, GRABIENT AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:\n\n• LOSS OF PROFITS, DATA, USE, OR GOODWILL\n• SERVICE INTERRUPTION OR COMPUTER DAMAGE\n• COST OF SUBSTITUTE SERVICES\n• ANY DAMAGES ARISING FROM YOUR USE OF THE SERVICE"
    },
    {
      title: "12. Indemnification",
      content: "You agree to indemnify, defend, and hold harmless Grabient and its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from:\n\n• Your use of the Service\n• Your violation of these Terms\n• Your violation of any rights of another party\n• Any content you submit to the Service"
    },
    {
      title: "13. Modifications to Service",
      content: "We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service."
    },
    {
      title: "14. Changes to Terms",
      content: "We may revise these Terms at any time by updating this page. Material changes will be indicated by updating the \"Last updated\" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.\n\nWe encourage you to review these Terms periodically for any changes."
    }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">Terms of Service</h1>
          <p className="text-white/45 text-lg">Last updated: December 25, 2025</p>
        </div>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <div className="text-white/45 leading-relaxed whitespace-pre-line text-[15px]">
                {section.content.split('\n').map((line, i, arr) => {
                  const isSubHeading = /^\d+\.\d+\s/.test(line);
                  return (
                    <React.Fragment key={i}>
                      {isSubHeading ? <span className="text-white font-medium">{line}</span> : line}
                      {i < arr.length - 1 && '\n'}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

     
      </motion.div>
    </div>
  );
};

export default TermsPage;

