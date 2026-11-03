import React from "react";
import { PageTitle } from "@/components/PageTitle";

const sections = [
  {
    title: "Free to use",
    content:
      "Huesole is free software. You can browse the collection, copy gradient CSS, and save favorites without creating an account or paying.",
  },
  {
    title: "Open source",
    content:
      "The source code is released under the MIT license. You may use, copy, modify, and share it, including in commercial projects, as long as you keep the license notice.",
  },
  {
    title: "No warranty",
    content:
      "The gradients and the website are provided as-is, without warranty. You are responsible for how you use the colors and CSS in your own work.",
  },
];

const TermsPage: React.FC = () => {
  return (
    <div className="container flex min-h-[70vh] justify-center px-4 py-16">
      <PageTitle title="Terms — Huesole" />
      <div className="w-full max-w-3xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#fafafa]">Terms</h1>
          <p className="text-lg text-[#a1a1a1]">Simple terms for a simple tool.</p>
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

export default TermsPage;
