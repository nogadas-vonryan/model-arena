'use client'

import { Model, BenchmarkScores } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

interface ModelComparisonTableProps {
  models: Array<{ model: Model; scores: BenchmarkScores }>
  selectedModelIds: string[]
  onSelectedModelsChange: (ids: string[]) => void
}

export function ModelComparisonTable({
  models,
  selectedModelIds,
  onSelectedModelsChange,
}: ModelComparisonTableProps) {
  const toggleModel = (modelId: string) => {
    const newSelected = selectedModelIds.includes(modelId)
      ? selectedModelIds.filter((id) => id !== modelId)
      : selectedModelIds.length < 4
        ? [...selectedModelIds, modelId]
        : selectedModelIds

    onSelectedModelsChange(newSelected)
  }

  const selectedData = models.filter((m) => selectedModelIds.includes(m.model.id))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Select up to 4 models to compare:</span>
        <Badge variant="outline">{selectedModelIds.length}/4 selected</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 w-10"></th>
              <th className="text-left p-3">Model</th>
              <th className="text-left p-3">Provider</th>
              <th className="text-left p-3">Context</th>
              <th className="text-center p-3" colSpan={3}>
                Chatbot Arena
              </th>
              <th className="text-center p-3" colSpan={3}>
                LiveCodeBench
              </th>
              <th className="text-center p-3">SWE-bench</th>
            </tr>
            <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
              <th className="p-2"></th>
              <th className="p-2"></th>
              <th className="p-2"></th>
              <th className="p-2"></th>
              <th className="p-2 text-center">Overall</th>
              <th className="p-2 text-center">Coding</th>
              <th className="p-2 text-center">Math</th>
              <th className="p-2 text-center">Pass@1</th>
              <th className="p-2 text-center">Pass@5</th>
              <th className="p-2 text-center">Pass@10</th>
              <th className="p-2 text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {models.map(({ model, scores }) => (
              <tr
                key={model.id}
                className={`border-b hover:bg-muted/30 ${
                  selectedModelIds.includes(model.id) ? 'bg-primary/10' : ''
                }`}
              >
                <td className="p-3">
                  <Checkbox
                    checked={selectedModelIds.includes(model.id)}
                    onCheckedChange={() => toggleModel(model.id)}
                    disabled={!selectedModelIds.includes(model.id) && selectedModelIds.length >= 4}
                  />
                </td>
                <td className="p-3 font-medium">{model.name}</td>
                <td className="p-3 text-muted-foreground">{model.provider}</td>
                <td className="p-3 text-muted-foreground">
                  {model.contextWindow.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  {scores.arena ? Math.round(scores.arena.overall) : '-'}
                </td>
                <td className="p-3 text-center">
                  {scores.arena ? Math.round(scores.arena.coding) : '-'}
                </td>
                <td className="p-3 text-center">
                  {scores.arena ? Math.round(scores.arena.math) : '-'}
                </td>
                <td className="p-3 text-center">
                  {scores.liveCodeBench ? Math.round(scores.liveCodeBench.passAt1) : '-'}
                </td>
                <td className="p-3 text-center">
                  {scores.liveCodeBench ? Math.round(scores.liveCodeBench.passAt5) : '-'}
                </td>
                <td className="p-3 text-center">
                  {scores.liveCodeBench ? Math.round(scores.liveCodeBench.passAt10) : '-'}
                </td>
                <td className="p-3 text-center">
                  {scores.swebench ? Math.round(scores.swebench.score) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Models Comparison */}
      {selectedData.length >= 1 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Selected Models ({selectedData.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedData.map(({ model, scores }) => (
              <div
                key={model.id}
                className="rounded-lg border border-primary bg-primary/5 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{model.name}</h4>
                    <p className="text-xs text-muted-foreground">{model.provider}</p>
                  </div>
                  <button
                    onClick={() => toggleModel(model.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Remove ${model.name}`}
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arena Overall:</span>
                    <span className="font-medium">
                      {scores.arena ? Math.round(scores.arena.overall) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arena Coding:</span>
                    <span className="font-medium">
                      {scores.arena ? Math.round(scores.arena.coding) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LiveCode Pass@1:</span>
                    <span className="font-medium">
                      {scores.liveCodeBench ? Math.round(scores.liveCodeBench.passAt1) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SWE-bench:</span>
                    <span className="font-medium">
                      {scores.swebench ? Math.round(scores.swebench.score) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
