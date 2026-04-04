import { AnimatePresence, motion } from "motion/react";

interface FilterStatusProps {
  filteredCount: number;
  searchTerm: string;
}

export const FilterStatus: React.FC<FilterStatusProps> = ({
  filteredCount,
  searchTerm,
}) => {
  const isVisible = searchTerm || filteredCount > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mt-2"
        >
          Found {filteredCount} gradient{filteredCount !== 1 ? "s" : ""}
          {searchTerm && (
            <span className="text-white/40 italic lowercase font-normal">
              {" "}
              for "{searchTerm}"
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
