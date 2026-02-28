'use client'

import { ReactNode } from 'react'
import { Model, BenchmarkScores } from '@/types'
import { X } from 'lucide-react'

interface CompareLayoutProps {
  models: Model[]
  scores?: Record<string, BenchmarkScores>
  selectedModelIds: string[]
  onSelectionChange: (ids: string[]) => void
  selectorPanel: ReactNode
  tablePanel: ReactNode
  chartPanel: ReactNode
  sourcePanel?: ReactNode
}

export function CompareLayout({
  models,
  scores: _scores,
  selectedModelIds,
  onSelectionChange,
  selectorPanel,
  tablePanel,
  chartPanel,
  sourcePanel,
}: CompareLayoutProps) {
  const selectedModels = models.filter((m) => selectedModelIds.includes(m.id))

  const removeModel = (modelId: string) => {
    onSelectionChange(selectedModelIds.filter((id) => id !== modelId))
  }

  return (
    <div className="flex h-full gap-6">
      {/* Left sidebar - Model selector */}
      <aside className="w-80 flex-shrink-0 border-r pr-6 overflow-y-auto max-h-[calc(100vh-2rem)] sticky top-4">
        {selectorPanel}
      </aside>

      {/* Main content area */}
      <main className="flex-1 min-w-0 space-y-6">
        {/* Selected models summary */}
        {selectedModels.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Comparing:</span>
            {selectedModels.map((model) => (
              <div
                key={model.id}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                <span>{model.name}</span>
                <button
                  onClick={() => removeModel(model.id)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${model.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Comparison table */}
        {tablePanel}

        {/* Metrics chart */}
        {chartPanel}
      </main>

      {/* Right sidebar - Source panel */}
      {sourcePanel && (
        <aside className="w-80 flex-shrink-0 border-l pl-6 overflow-y-auto max-h-[calc(100vh-2rem)] sticky top-4">
          {sourcePanel}
        </aside>
      )}
    </div>
  )
}
