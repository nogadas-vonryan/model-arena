'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui'
import { Filter } from 'lucide-react'

type BenchmarkSource = 'arena' | 'artificialAnalysis' | 'liveCodeBench' | 'swebench'
type TaskType = 'chat' | 'code' | 'reasoning' | 'all'

interface BenchmarkFilterProps {
  onFilterChange?: (filters: { sources: BenchmarkSource[]; taskType: TaskType }) => void
}

const SOURCE_LABELS: Record<BenchmarkSource, string> = {
  arena: 'Chatbot Arena',
  artificialAnalysis: 'ArtificialAnalysis',
  liveCodeBench: 'LiveCodeBench',
  swebench: 'SWE-bench',
}

const TASK_TYPES: { key: TaskType; label: string; sources: BenchmarkSource[] }[] = [
  {
    key: 'all',
    label: 'All Tasks',
    sources: ['arena', 'artificialAnalysis', 'liveCodeBench', 'swebench'],
  },
  { key: 'chat', label: 'Chat', sources: ['arena', 'artificialAnalysis'] },
  { key: 'code', label: 'Code', sources: ['arena', 'liveCodeBench', 'swebench'] },
  { key: 'reasoning', label: 'Reasoning', sources: ['arena'] },
]

export function BenchmarkFilter({ onFilterChange }: BenchmarkFilterProps) {
  const [selectedSources, setSelectedSources] = useState<BenchmarkSource[]>([
    'arena',
    'artificialAnalysis',
    'liveCodeBench',
    'swebench',
  ])
  const [taskType, setTaskType] = useState<TaskType>('all')

  const toggleSource = (source: BenchmarkSource) => {
    const newSources = selectedSources.includes(source)
      ? selectedSources.filter((s) => s !== source)
      : [...selectedSources, source]

    // Don't allow deselecting all
    if (newSources.length === 0) return

    setSelectedSources(newSources)
    onFilterChange?.({ sources: newSources, taskType })
  }

  const handleTaskTypeChange = (type: TaskType) => {
    setTaskType(type)
    const taskConfig = TASK_TYPES.find((t) => t.key === type)
    if (taskConfig) {
      setSelectedSources(taskConfig.sources)
      onFilterChange?.({ sources: taskConfig.sources, taskType: type })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Filter Benchmarks</h3>
      </div>

      {/* Task type filter */}
      <div>
        <span className="text-sm text-muted-foreground mr-2">Task Type:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {TASK_TYPES.map((task) => (
            <Badge
              key={task.key}
              variant={taskType === task.key ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleTaskTypeChange(task.key)}
            >
              {task.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Source filter */}
      <div>
        <span className="text-sm text-muted-foreground mr-2">Sources:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(SOURCE_LABELS).map(([key, label]) => (
            <Badge
              key={key}
              variant={selectedSources.includes(key as BenchmarkSource) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleSource(key as BenchmarkSource)}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active filters summary */}
      {selectedSources.length < 4 && (
        <div className="text-xs text-muted-foreground">
          Showing {selectedSources.length} of 4 benchmark sources
        </div>
      )}
    </div>
  )
}
