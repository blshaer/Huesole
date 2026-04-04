import { cn } from "@/shared/lib/utils"
import { VercelSpinner } from "@/shared/ui/VercelSpinner"

function Spinner({ className, size = 40, ...props }: React.ComponentProps<"div"> & { size?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <VercelSpinner size={size} />
    </div>
  )
}

export { Spinner }
