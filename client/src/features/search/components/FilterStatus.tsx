interface FilterStatusProps {
  filteredCount: number;
  searchTerm: string;
}

export const FilterStatus: React.FC<FilterStatusProps> = ({
  filteredCount,
  searchTerm,
}) => {
  if (!searchTerm && filteredCount === 0) return null;

  return (
    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mt-2">
      Found {filteredCount} gradient{filteredCount !== 1 ? "s" : ""}
      {searchTerm && (
        <span className="text-white/40 italic lowercase font-normal"> for "{searchTerm}"</span>
      )}
    </div>
  );
};
