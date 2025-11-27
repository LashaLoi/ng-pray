import type { HTMLAttributes } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Loader({ className, size = "md", ...props }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin text-muted-foreground",
          sizeMap[size] ?? sizeMap.md,
        )}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}


