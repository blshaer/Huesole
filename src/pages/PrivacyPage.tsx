import React from "react";
import { PageTitle } from "@/components/PageTitle";

const sections = [
  {
    title: "What this site stores",
    content:
      "Huesole runs in your browser. Favorites and hidden gradients are saved in local storage on your device. Nothing is sent to an account server, because there are no accounts.",
  },
  {
    title: "What we do not collect",
    content:
      "This project does not ask for an email address, password, or payment. It does not use advertising, analytics, or a database.",
  },
  {
    title: "Third parties",
    content:
      "Fonts are loaded from Google Fonts so the interface can render. Your browser may also request the page itself from wherever you host it. Those hosts see normal web request data such as an IP address.",
  },
  {
    title: "Your choices",
    content:
      "Clear this site's data in your browser settings to remove saved favorites. You can also read, modify, and host the source code yourself under the MIT license.",
  },
];

const PrivacyPage: React.FC = () => {
  return (
    <div className="container flex min-h-[70vh] justify-center px-4 py-16">
      <PageTitle title="Privacy — Huesole" />
      <div className="w-full max-w-3xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#fafafa]">Privacy</h1>
          <p className="text-lg text-[#a1a1a1]">A local, free gradient library.</p>
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-[#fafafa]">{section.title}</h2>
              <p className="text-[15px] leading-relaxed text-[#d4d4d4]">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
