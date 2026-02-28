import * as React from "react";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ScoreBadge({
  score,
  maxScore = 100,
  size = "md",
  showLabel = false,
  label,
  className,
}: ScoreBadgeProps) {
  const percentage = (score / maxScore) * 100;
  
  const getColorClass = () => {
    if (percentage >= 80) return "bg-success text-success-foreground";
    if (percentage >= 60) return "bg-info text-info-foreground";
    if (percentage >= 40) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded font-semibold",
          getColorClass(),
          sizeClasses[size]
        )}
      >
        {score}
      </div>
      {showLabel && label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
