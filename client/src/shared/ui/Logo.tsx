import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Logo() {
  return (
    <>
      {/* Embedded CSS keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          animation: gradientShift 6s ease infinite;
        }

        .underline-shadow {
          filter: blur(8px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .logo-wrapper:hover .underline-shadow {
          opacity: 0.7;
        }
      `}</style>

      <Link to={"/"}>
        <div className="logo-wrapper relative inline-block cursor-pointer select-none">
          <h1 className="relative z-10 text-2xl font-bold text-[var(--headline)]">
            GradlyAI
          </h1>

          {/* Blurred gradient shadow - appears on hover */}
          <div className="underline-shadow animate-gradient absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CF77F3] via-[#009BFF] to-[#2AC9DB] bg-[length:400%_400%]" />

          {/* Main animated gradient underline */}
          <motion.div
            className="animate-gradient absolute bottom-[-4px] left-0 right-0 mx-auto h-1 w-[50px] rounded-full bg-gradient-to-r from-[#CF77F3] via-[#009BFF] to-[#2AC9DB] bg-[length:400%_400%]"
            whileHover={{
              height: "4px",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
      </Link>
    </>
  );
}
