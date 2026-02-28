'use client'

import { useState, useMemo } from 'react'
import { Model, BenchmarkScores } from '@/types'
import { Card, CardContent, Input, Badge, Button } from '@/components/ui'
import { formatNumber } from '@/lib/utils'

interface ModelSelectorProps {
  models: Model[]
  scores: Record<string, BenchmarkScores>
  selectedModelIds: string[]
  maxSelection?: number
  onSelectionChange: (selectedIds: string[]) => void
}

export function ModelSelector({
  models,
  scores,
  selectedModelIds,
  maxSelection = 4,
  onSelectionChange,
}: ModelSelectorProps) {
  const [search, setSearch] = useState('')
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [hasArenaScore, setHasArenaScore] = useState(false)
  const [hasLiveCodeScore, setHasLiveCodeScore] = useState(false)

  const providers = useMemo(() => {
    return Array.from(new Set(models.map((m) => m.provider)))
  }, [models])

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      // Search filter
      if (
        search &&
        !model.name.toLowerCase().includes(search.toLowerCase()) &&
        !model.provider.toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }

      // Provider filter
      if (selectedProviders.length > 0 && !selectedProviders.includes(model.provider)) {
        return false
      }

      // Benchmark availability filters
      const modelScores = scores[model.id]
      if (hasArenaScore && !modelScores?.arena) {
        return false
      }
      if (hasLiveCodeScore && !modelScores?.liveCodeBench) {
        return false
      }

      return true
    })
  }, [models, search, selectedProviders, hasArenaScore, hasLiveCodeScore, scores])

  const toggleModel = (modelId: string) => {
    if (selectedModelIds.includes(modelId)) {
      onSelectionChange(selectedModelIds.filter((id) => id !== modelId))
    } else {
      if (selectedModelIds.length >= maxSelection) {
        return
      }
      onSelectionChange([...selectedModelIds, modelId])
    }
  }

  const toggleProvider = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]
    )
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedProviders([])
    setHasArenaScore(false)
    setHasLiveCodeScore(false)
  }

  const hasFilters = search || selectedProviders.length > 0 || hasArenaScore || hasLiveCodeScore

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search models..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />

      {/* Provider filters */}
      <div>
        <span className="text-sm font-medium mr-2">Provider:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {providers.map((provider) => (
            <Badge
              key={provider}
              variant={selectedProviders.includes(provider) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleProvider(provider)}
            >
              {provider}
            </Badge>
          ))}
        </div>
      </div>

      {/* Benchmark filters */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasArenaScore}
            onChange={(e) => setHasArenaScore(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Has Arena Score</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasLiveCodeScore}
            onChange={(e) => setHasLiveCodeScore(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Has LiveCode Score</span>
        </label>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      )}

      {/* Selection counter */}
      <div className="text-sm text-muted-foreground">
        Selected: {selectedModelIds.length} / {maxSelection}
      </div>

      {/* Model cards */}
      <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
        {filteredModels.map((model) => {
          const modelScores = scores[model.id]
          const isSelected = selectedModelIds.includes(model.id)
          const isDisabled = !isSelected && selectedModelIds.length >= maxSelection

          return (
            <Card
              key={model.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-primary/50'
              }`}
              onClick={() => !isDisabled && toggleModel(model.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{model.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Context: {formatNumber(model.contextWindow)}</span>
                      <span>Released: {model.releaseDate}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {modelScores?.arena && (
                      <Badge variant="success" className="text-xs">
                        Arena: {Math.round(modelScores.arena.overall)}
                      </Badge>
                    )}
                    {modelScores?.liveCodeBench && (
                      <Badge variant="info" className="text-xs">
                        LiveCode: {modelScores.liveCodeBench.passAt1.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No models match your filters</div>
      )}
    </div>
  )
}
