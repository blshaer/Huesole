import React, { memo, useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { FaCss3Alt, FaHeart } from "react-icons/fa";
import { SiSvg, SiTailwindcss } from "react-icons/si";

interface FeatureBadgeProps {
  icon?: React.ReactNode;
  text: string;
  className?: string;
  highlight?: boolean;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = memo(
  ({ icon, text, className, highlight }) => {
    const [showCircle, setShowCircle] = useState(false);

    useEffect(() => {
      if (!highlight) return;
      const frame = requestAnimationFrame(() => setShowCircle(true));
      return () => cancelAnimationFrame(frame);
    }, [highlight]);

    return (
      <div
        className={`bg-primary/10 relative flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-primary ${className || ""}`}
      >
        {icon && (
          <span role="img" aria-label={text} className="mr-1 flex items-center">
            {icon}
          </span>
        )}
        {highlight ? (
          <RoughNotation
            type="circle"
            show={showCircle}
            color="#fafafa"
            padding={8}
            strokeWidth={1.5}
            animationDuration={750}
          >
            <span>{text}</span>
          </RoughNotation>
        ) : (
          <span>{text}</span>
        )}
      </div>
    );
  },
);

export const HeroFeatures: React.FC = () => {
  const features = [
    { icon: <SiTailwindcss size={16} color="#fafafa" />, text: "Tailwind CSS" },
    { icon: <FaCss3Alt size={16} color="#fafafa" />, text: "CSS" },
    { icon: <SiSvg size={16} color="#fafafa" />, text: "SVG" },
    { icon: <FaHeart size={16} color="#fafafa" />, text: "Saved locally" },
    { icon: null, text: "No signup", highlight: true },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pb-2 pt-4 max-md:hidden">
      {features.map((feature, idx) => (
        <FeatureBadge
          key={feature.text + idx}
          icon={feature.icon}
          text={feature.text}
          highlight={Boolean(feature.highlight)}
        />
      ))}
    </div>
  );
};
