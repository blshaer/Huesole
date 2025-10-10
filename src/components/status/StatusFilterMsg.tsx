import { AnimatePresence, motion } from "framer-motion";

export const StatusFilterMsg = ({
  count,
  selectedColors,
  searchTerm,
  filter,
}: {
  count: number;
  selectedColors: string[];
  searchTerm: string;
  filter: string;
}) => {
  const shouldShow = selectedColors.length > 0 || searchTerm || filter !== "all";
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-foreground/70 text-sm"
        >
          Showing {count} gradient{count !== 1 ? "s" : ""}
          {selectedColors.length > 0 && (
            <span> with colors: {selectedColors.join(", ")}</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
