import * as React from "react";
import { Clock } from "lucide-react";
import { cn, formatDateRelative } from "@/lib/utils";

interface DataFreshnessTagProps {
  lastUpdated: string;
  className?: string;
}

export function DataFreshnessTag({ lastUpdated, className }: DataFreshnessTagProps) {
  const relativeTime = formatDateRelative(lastUpdated);
  
  const getVariant = () => {
    const date = new Date(lastUpdated);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "success";
    if (diffDays <= 7) return "info";
    if (diffDays <= 30) return "warning";
    return "destructive";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <Clock className="h-3 w-3" />
      <span>Updated {relativeTime}</span>
    </div>
  );
}
