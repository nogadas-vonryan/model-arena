'use client'

import { Model, BenchmarkScores } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ScoreBadge } from '@/components/ui/score-badge'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useState } from 'react'

interface BenchmarkTableProps {
  models: Model[]
  scores: Record<string, BenchmarkScores>
}

type SortKey = 'name' | 'arena' | 'artificialAnalysis' | 'liveCodeBench' | 'swebench'
type SortDirection = 'asc' | 'desc'

interface SortConfig {
  key: SortKey
  direction: SortDirection
}

interface SortIconProps {
  columnKey: SortKey
  sortConfig: SortConfig
}

function SortIcon({ columnKey, sortConfig }: SortIconProps) {
  if (sortConfig.key !== columnKey) {
    return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />
  }
  return sortConfig.direction === 'asc' ? (
    <ArrowUp className="w-4 h-4 ml-1" />
  ) : (
    <ArrowDown className="w-4 h-4 ml-1" />
  )
}

export function BenchmarkTable({ models, scores }: BenchmarkTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' })

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedModels = [...models].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1

    switch (sortConfig.key) {
      case 'name':
        return direction * a.name.localeCompare(b.name)

      case 'arena':
        const aArena = scores[a.id]?.arena?.overall ?? 0
        const bArena = scores[b.id]?.arena?.overall ?? 0
        return direction * (aArena - bArena)

      case 'artificialAnalysis':
        const aAA = scores[a.id]?.artificialAnalysis?.quality ?? 0
        const bAA = scores[b.id]?.artificialAnalysis?.quality ?? 0
        return direction * (aAA - bAA)

      case 'liveCodeBench':
        const aLC = scores[a.id]?.liveCodeBench?.passAt1 ?? 0
        const bLC = scores[b.id]?.liveCodeBench?.passAt1 ?? 0
        return direction * (aLC - bLC)

      case 'swebench':
        const aSWE = scores[a.id]?.swebench?.score ?? 0
        const bSWE = scores[b.id]?.swebench?.score ?? 0
        return direction * (aSWE - bSWE)

      default:
        return 0
    }
  })

  const getScoreCell = (model: Model, source: keyof BenchmarkScores) => {
    const modelScores = scores[model.id]
    if (!modelScores?.[source]) {
      return <span className="text-muted-foreground text-sm">—</span>
    }

    const sourceScores = modelScores[source]

    switch (source) {
      case 'arena':
        return (
          <div className="space-y-1">
            <ScoreBadge score={Math.round((sourceScores as any).overall)} size="sm" />
            <div className="flex gap-1 text-xs text-muted-foreground">
              <span title="Coding score">C: {(sourceScores as any).coding?.toFixed(0)}</span>
              <span title="Math score">M: {(sourceScores as any).math?.toFixed(0)}</span>
              <span title="Reasoning score">R: {(sourceScores as any).reasoning?.toFixed(0)}</span>
            </div>
          </div>
        )

      case 'artificialAnalysis':
        return (
          <div className="space-y-1">
            <ScoreBadge score={(sourceScores as any).quality?.toFixed(1) ?? 0} size="sm" />
            <div className="text-xs text-muted-foreground">
              Speed: {(sourceScores as any).speed?.toFixed(1)} tok/s
            </div>
          </div>
        )

      case 'liveCodeBench':
        return (
          <div className="space-y-1">
            <ScoreBadge score={(sourceScores as any).passAt1?.toFixed(1) ?? 0} size="sm" />
            <div className="text-xs text-muted-foreground">
              Pass@5: {(sourceScores as any).passAt5?.toFixed(1)}
            </div>
          </div>
        )

      case 'swebench':
        return (
          <div className="space-y-1">
            <ScoreBadge score={((sourceScores as any).score ?? 0) * 100} size="sm" />
            <div className="text-xs text-muted-foreground">
              {(sourceScores as any).testsPassed}/{(sourceScores as any).testsTotal} tests
            </div>
          </div>
        )

      default:
        return <span className="text-muted-foreground text-sm">—</span>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Benchmark Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                  >
                    Model
                    <SortIcon columnKey="name" sortConfig={sortConfig} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  <button
                    onClick={() => handleSort('arena')}
                    className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                  >
                    Chatbot Arena
                    <SortIcon columnKey="arena" sortConfig={sortConfig} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  <button
                    onClick={() => handleSort('artificialAnalysis')}
                    className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                  >
                    ArtificialAnalysis
                    <SortIcon columnKey="artificialAnalysis" sortConfig={sortConfig} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  <button
                    onClick={() => handleSort('liveCodeBench')}
                    className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                  >
                    LiveCodeBench
                    <SortIcon columnKey="liveCodeBench" sortConfig={sortConfig} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  <button
                    onClick={() => handleSort('swebench')}
                    className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                  >
                    SWE-bench
                    <SortIcon columnKey="swebench" sortConfig={sortConfig} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedModels.map((model, index) => (
                <tr
                  key={model.id}
                  className={`border-b last:border-0 hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                  }`}
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-muted-foreground">{model.provider}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{getScoreCell(model, 'arena')}</td>
                  <td className="py-4 px-4">{getScoreCell(model, 'artificialAnalysis')}</td>
                  <td className="py-4 px-4">{getScoreCell(model, 'liveCodeBench')}</td>
                  <td className="py-4 px-4">{getScoreCell(model, 'swebench')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedModels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No models to compare. Select models from the panel.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
