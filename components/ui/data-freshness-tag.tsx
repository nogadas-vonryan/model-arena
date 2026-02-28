import * as React from 'react'
import { Clock } from 'lucide-react'
import { cn, formatDateRelative } from '@/lib/utils'

interface DataFreshnessTagProps {
  lastUpdated: string
  className?: string
}

export function DataFreshnessTag({ lastUpdated, className }: DataFreshnessTagProps) {
  const relativeTime = formatDateRelative(lastUpdated)

  return (
    <div
      className={cn('inline-flex items-center gap-1.5 text-xs text-muted-foreground', className)}
    >
      <Clock className="h-3 w-3" />
      <span>Updated {relativeTime}</span>
    </div>
  )
}
