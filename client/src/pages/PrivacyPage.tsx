import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VercelSpinner } from "@/shared/ui/VercelSpinner";

const PrivacyPage: React.FC = () => {
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
      title: "1. Introduction",
      content: "Welcome to Grabient (\"we,\" \"our,\" or \"us\"). We are committed to protecting your privacy and being transparent about how we collect, use, and share your personal information. This Privacy Policy explains our practices regarding data collection when you use our website at grabient.com (the \"Service\").\n\nBy using Grabient, you agree to the collection and use of information in accordance with this policy. If you do not agree with our practices, please do not use our Service."
    },
    {
      title: "2. Information We Collect",
      content: "2.1 Information You Provide\nWhen you create an account or use our Service, you may provide:\n• Account Information: Email address, username (optional), and profile avatar image (optional)\n• Authentication Data: If you sign in with Google OAuth, we receive your Google account email and profile information\n• User-Generated Content: Gradient palettes you create and save, including gradient parameters (seed, style, steps, angle)\n• Contact Information: Email address and message content when you use our contact form\n\n2.2 Information Collected Automatically\nWhen you access or use our Service, we automatically collect:\n• Device and Browser Information: IP address, browser type and version, operating system, and user agent\n• Usage Data: Pages visited, features used, gradient actions (copying, downloading, saving), and interaction patterns\n• Session Information: Session tokens, login timestamps, and session expiration data"
    },
    {
      title: "3. How We Use Your Information",
      content: "We use the information we collect to:\n• Provide, maintain, and improve our Service\n• Create and manage your account, including authentication\n• Save and display your gradient palettes and preferences\n• Respond to your inquiries and provide customer support\n• Send transactional emails (magic links for authentication, account deletion confirmation)\n• Analyze usage patterns to improve user experience\n• Monitor and prevent fraud, abuse, and security issues\n• Comply with legal obligations"
    },
    {
      title: "4. Third-Party Services",
      content: "We use the following third-party services to operate and improve our Service. These services may collect information about you as described below:\n\n4.1 Analytics Services\nPostHog: We use PostHog for product analytics to understand how users interact with our Service. PostHog may collect usage events, page views, and interaction data. With your consent, PostHog may also record sessions (with sensitive data masked). PostHog is GDPR-compliant and participates in the EU-US Data Privacy Framework. Learn more: PostHog Privacy Policy\nGoogle Analytics 4: We use Google Analytics to analyze website traffic and usage patterns. Google Analytics collects information such as pages visited, time spent on pages, and demographic data. IP addresses are anonymized by default in GA4. Learn more: Google Privacy Policy\n\n4.2 Advertising\nGoogle AdSense: We display ads served by Google. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising at Google Ads Settings. Learn more: Google Privacy Policy\n\n4.3 Error Tracking\nSentry: We use Sentry to monitor and fix errors in our Service. Sentry may collect error reports, browser information, and diagnostic data. With your consent, Sentry may also record sessions for debugging purposes (with sensitive data masked). Sentry is GDPR-compliant and certified under the EU-US Data Privacy Framework. Learn more: Sentry Privacy Policy\n\n4.4 Infrastructure Services\nCloudflare: Our Service is hosted on Cloudflare's infrastructure, including Cloudflare Workers (computing), D1 (database), and R2 (file storage). All data is encrypted at rest and in transit. Cloudflare is GDPR-compliant and offers data processing agreements. Learn more: Cloudflare GDPR Compliance\nResend: We use Resend to send transactional emails (authentication links, account notifications). Resend processes email addresses and message content. Resend is GDPR-compliant and certified under the EU-US Data Privacy Framework. Learn more: Resend Privacy Policy\n\n4.5 Authentication Services\nGoogle OAuth: If you choose to sign in with Google, we receive basic profile information from Google (email, name, profile picture). We do not receive your Google password. Learn more: Google Privacy Policy"
    },
    {
      title: "5. Cookies and Tracking Technologies",
      content: "We use cookies and similar technologies to operate our Service and collect information:\n\n5.1 Cookie Consent Management\nWe use Cloudflare Zaraz to manage third-party tools and cookie consent in compliance with GDPR and other privacy regulations. Zaraz loads third-party scripts through Cloudflare's edge network, improving privacy and performance. Learn more: Cloudflare GDPR Compliance\n\n5.2 Essential Cookies\nThese cookies are necessary for the Service to function and cannot be disabled:\n• Session cookies: Used to maintain your login session (HTTP-only, secure)\n• Consent preferences: Stored in localStorage to remember your privacy choices\n• Theme preference: Stored in localStorage to remember your light/dark mode setting\n\n5.3 Analytics Cookies (Consent Required)\nWith your consent, we use analytics cookies from:\n• PostHog (product analytics)\n• Google Analytics 4 (web analytics)\n• Sentry (error tracking)\n\n5.4 Advertising Cookies (Consent Required)\nWith your consent, we use advertising cookies from:\n• Google AdSense (personalized advertising)\nThese cookies enable personalized ads based on your browsing activity. You can opt out of personalized advertising at any time through our cookie consent banner or in your account settings.\n\n5.5 Regional Consent Behavior\nOur consent defaults vary by region based on applicable privacy laws:\n• EEA, UK (GDPR regions): All non-essential cookies and tracking are disabled by default. You must explicitly opt-in to enable analytics, session replay, or advertising features.\n• Other regions: Analytics and advertising are enabled by default under legitimate interest. You can opt-out at any time in your account settings.\n\n5.6 Session Recording (Separate Consent Required)\nWith your explicit consent to Session Replay, we may record your session to understand how users interact with our Service and identify usability issues. Session Replay is a separate consent option from Analytics. Session recordings:\n• Are fully anonymized with all text and inputs masked\n• Block media and images from being recorded\n• Require separate opt-in via the Session Replay toggle in your settings"
    },
    {
      title: "6. Your Privacy Choices",
      content: "6.1 Consent Management\nYou can manage your privacy preferences at any time by visiting the Privacy & Consent section in your account settings. There you can individually toggle:\n• Analytics: Anonymous usage analytics to help us improve\n• Session Replay: Anonymized session recordings\n• Marketing: Personalized ads and marketing content\n\n6.2 Account Controls\nIf you have an account, you can:\n• Update your profile information in account settings\n• Delete your saved gradients\n• Delete your account entirely (this permanently removes all your data)\n\n6.3 Browser Controls\nMost browsers allow you to control cookies through their settings. You can also use browser extensions to block tracking. Note that blocking essential cookies may affect the functionality of our Service."
    },
    {
      title: "7. Data Retention",
      content: "We retain your personal information for as long as necessary to provide our Service and fulfill the purposes described in this policy:\n• Account data: Retained until you delete your account\n• Session data: Sessions expire after 7 days of inactivity\n• Magic link tokens: Expire after 5 minutes\n• Account deletion tokens: Expire after 24 hours\n• Analytics data: Retained according to each third-party provider's retention policy\n• Contact form messages: Retained as needed to respond to inquiries"
    },
    {
      title: "8. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information:\n• All data is encrypted in transit using TLS/HTTPS\n• All data is encrypted at rest (AES-256)\n• Passwords are hashed using scrypt algorithm\n• Session cookies are HTTP-only and secure\n• Rate limiting protects against abuse\n• CSRF protection is enabled on all forms\n\nWhile we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security."
    },
    {
      title: "9. International Data Transfers",
      content: "Your information may be transferred to and processed in countries other than your own, including the United States. Our service providers maintain appropriate safeguards for international data transfers:\n• EU-US Data Privacy Framework certification (where applicable)\n• Standard Contractual Clauses (SCCs) for EU data\n• Data Processing Agreements with all subprocessors"
    },
    {
      title: "10. Your Rights",
      content: "10.1 Rights for All Users\nRegardless of your location, you have the right to:\n• Access the personal information we hold about you\n• Correct inaccurate personal information\n• Delete your account and associated data\n• Withdraw consent for analytics and tracking\n\n10.2 Additional Rights for EU/EEA Residents (GDPR)\nIf you are in the European Union or European Economic Area, you also have the right to:\n• Request restriction of processing of your personal data\n• Object to processing based on legitimate interests\n• Request data portability (receive your data in a structured, machine-readable format)\n• Lodge a complaint with your local data protection authority\n\n10.3 Additional Rights for California Residents (CCPA/CPRA)\nIf you are a California resident, you have the right to:\n• Know what personal information we collect, use, and disclose\n• Request deletion of your personal information\n• Opt-out of the \"sale\" or \"sharing\" of your personal information\n• Non-discrimination for exercising your privacy rights\n\nWe do not sell your personal information. We do not share your personal information for cross-context behavioral advertising."
    },
    {
      title: "11. Children's Privacy",
      content: "Our Service is not directed to children under 13 years of age (or 16 in the EU). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately."
    },
    {
      title: "12. Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the \"Last updated\" date. We encourage you to review this policy periodically."
    },
    {
      title: "13. Contact Us",
      content: "If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us. For data protection inquiries, please include \"Privacy Request\" in your message subject."
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
          <h1 className="text-4xl font-bold tracking-tight text-white">Privacy Policy</h1>
          <p className="text-white/45 text-lg">Last updated: December 25, 2025</p>
        </div>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <div className="text-white/45 leading-relaxed whitespace-pre-line text-[15px]">
                {section.content}
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
};

export default PrivacyPage;

