'use client'

import { useState } from 'react'
import { Model, BenchmarkScores } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

interface ModelComparisonTableProps {
  models: Array<{ model: Model; scores: BenchmarkScores }>
}

export function ModelComparisonTable({ models }: ModelComparisonTableProps) {
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set())

  const toggleModel = (modelId: string) => {
    const newSelected = new Set(selectedModels)
    if (newSelected.has(modelId)) {
      newSelected.delete(modelId)
    } else if (newSelected.size < 2) {
      newSelected.add(modelId)
    }
    setSelectedModels(newSelected)
  }

  const selectedData = models.filter((m) => selectedModels.has(m.model.id))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Select up to 2 models to compare:</span>
        <Badge variant="outline">{selectedModels.size}/2 selected</Badge>
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
                  selectedModels.has(model.id) ? 'bg-primary/10' : ''
                }`}
              >
                <td className="p-3">
                  <Checkbox
                    checked={selectedModels.has(model.id)}
                    onCheckedChange={() => toggleModel(model.id)}
                    disabled={!selectedModels.has(model.id) && selectedModels.size >= 2}
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

      {selectedData.length === 2 && (
        <Card className="mt-4 border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              {selectedData.map(({ model, scores }) => (
                <div key={model.id}>
                  <h4 className="font-medium mb-2">{model.name}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Arena Overall:</span>
                      <span>{scores.arena ? Math.round(scores.arena.overall) : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">LiveCode Pass@1:</span>
                      <span>
                        {scores.liveCodeBench ? Math.round(scores.liveCodeBench.passAt1) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SWE-bench:</span>
                      <span>{scores.swebench ? Math.round(scores.swebench.score) : '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
