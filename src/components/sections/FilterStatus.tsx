interface FilterStatusProps {
  filteredCount: number;
  selectedColors: string[];
  searchTerm: string;
  filter: string;
}

export const FilterStatus: React.FC<FilterStatusProps> = ({
  filteredCount,
  selectedColors,
  searchTerm,
  filter,
}) => {
  const shouldShow = selectedColors.length > 0 || searchTerm || filter !== "all";

  if (!shouldShow) return null;

  return (
    <div className="text-sm text-muted-foreground">
      Showing {filteredCount} gradient
      {filteredCount !== 1 ? "s" : ""}
      {selectedColors.length > 0 && (
        <span> with colors: {selectedColors.join(", ")}</span>
      )}
    </div>
  );
};