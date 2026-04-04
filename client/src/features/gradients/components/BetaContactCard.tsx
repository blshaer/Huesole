import React from "react";
import { MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const BetaContactCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 group">
      {/* Decorative Blur */}
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all" />
      
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] via-[#1E40AF] to-[#1D4ED8] shadow-lg shadow-blue-500/20">
            <svg viewBox="0 0 256 222" className="h-3 w-3 fill-white">
              <path d="m128 0 128 221.705H0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-white leading-none">LumeGradients</h4>
            <span className="text-[9px] text-blue-400 font-medium tracking-wider uppercase mt-1 inline-block">v1.1.2-beta</span>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-white/40">
          We're currently in open beta. Help us shape the future of AI generative design by sharing your thoughts.
        </p>

        <div className="h-px w-full bg-white/5" />

        <div className="flex items-center justify-between">
          <Link 
            to="/contact" 
            className="flex items-center gap-2 text-[11px] font-semibold text-white/60 hover:text-white transition-colors"
          >
            <MessageSquare className="h-3 w-3" />
            <span>Send Feedback</span>
          </Link>

          <Link 
            to="/contact"
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
          >
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
