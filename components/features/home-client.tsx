'use client'

import { useMemo, useCallback } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { Model, BenchmarkScores } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, DataFreshnessTag } from '@/components/ui'
import {
  ModelCard,
  FilterBar,
  ModelComparisonTable,
  MetricsChart,
  QuickCompare,
  GranularErrorBoundary,
} from '@/components/features'
import type { FilterState } from '@/components/features/filter-bar'
import { Trophy, BarChart3, Code, Brain } from 'lucide-react'
import { SOURCE_INFO, MAX_MODEL_SELECTION } from '@/lib/constants'

interface Source {
  id: string
  lastUpdated: string
}

interface HomeClientProps {
  initialModels: Array<{ model: Model; scores: BenchmarkScores }>
  providers: string[]
  architectures: string[]
  tags: string[]
  sources: Source[]
}

const SOURCE_ICONS: Record<string, React.ElementType> = {
  arena: Trophy,
  aa: BarChart3,
  livecode: Code,
  swebench: Brain,
}

// Parser for comma-separated string to string array
const parseCommaSeparated = {
  parse: (value: string): string[] => value.split(',').filter(Boolean),
  serialize: (values: string[]): string => values.join(','),
  clearOnDefault: true,
  history: 'push' as const,
  defaultValue: [],
}

export function HomeClient({
  initialModels,
  providers,
  architectures,
  tags,
  sources,
}: HomeClientProps) {
  // Filter state persisted to URL
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withOptions({ clearOnDefault: true }).withDefault('')
  )
  const [selectedProviders, setSelectedProviders] = useQueryState('providers', parseCommaSeparated)
  const [selectedArchitectures, setSelectedArchitectures] = useQueryState(
    'architectures',
    parseCommaSeparated
  )
  const [selectedTags, setSelectedTags] = useQueryState('tags', parseCommaSeparated)

  const filters: FilterState = useMemo(
    () => ({
      search,
      providers: selectedProviders,
      architectures: selectedArchitectures,
      tags: selectedTags,
    }),
    [search, selectedProviders, selectedArchitectures, selectedTags]
  )

  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      setSearch(newFilters.search || null)
      setSelectedProviders(newFilters.providers.length > 0 ? newFilters.providers : null)
      setSelectedArchitectures(
        newFilters.architectures.length > 0 ? newFilters.architectures : null
      )
      setSelectedTags(newFilters.tags.length > 0 ? newFilters.tags : null)
    },
    [setSearch, setSelectedProviders, setSelectedArchitectures, setSelectedTags]
  )

  // Model selection state persisted to URL
  const [selectedModelIdsRaw, setSelectedModelIdsRaw] = useQueryState(
    'modelIds',
    parseAsString.withOptions({ clearOnDefault: true })
  )

  // Parse model IDs from URL
  const urlModelIds = (selectedModelIdsRaw || '')
    .split(',')
    .filter(Boolean)
    .slice(0, MAX_MODEL_SELECTION)
  const selectedModelIds = urlModelIds

  const handleSelectedModelsChange = (ids: string[]) => {
    const nonEmptyIds = ids.filter(Boolean).slice(0, MAX_MODEL_SELECTION)
    setSelectedModelIdsRaw(nonEmptyIds.join(',') || null)
  }

  const filteredModels = useMemo(() => {
    return initialModels.filter(({ model }) => {
      const matchesSearch =
        !filters.search ||
        model.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        model.provider.toLowerCase().includes(filters.search.toLowerCase())

      const matchesProvider =
        filters.providers.length === 0 || filters.providers.includes(model.provider)

      const matchesArchitecture =
        filters.architectures.length === 0 || filters.architectures.includes(model.architecture)

      const matchesTags =
        filters.tags.length === 0 || filters.tags.some((t) => model.tags.includes(t))

      return matchesSearch && matchesProvider && matchesArchitecture && matchesTags
    })
  }, [initialModels, filters])

  const selectedData = useMemo(() => {
    return filteredModels.filter(({ model }) => selectedModelIds.includes(model.id))
  }, [filteredModels, selectedModelIds])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-4xl font-bold text-center">Model Arena</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto text-center">
            Compare AI models side-by-side across multiple leaderboards
          </p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Data Sources Panel */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Data Sources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sources.map((source) => {
                const info = SOURCE_INFO[source.id as keyof typeof SOURCE_INFO]
                const Icon = SOURCE_ICONS[source.id]
                if (!info || !Icon) return null
                return (
                  <Card key={source.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium text-sm">{info.name}</h3>
                            <p className="text-xs text-muted-foreground">{info.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <DataFreshnessTag lastUpdated={source.lastUpdated} />
                        <a
                          href={info.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Source →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* Quick Compare - Hero Section */}
          <section className="py-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Compare Models</h2>
            <QuickCompare
              models={initialModels}
              selectedModelIds={selectedModelIds}
              onSelectionChange={handleSelectedModelsChange}
              maxSelection={MAX_MODEL_SELECTION}
            />
          </section>

          {/* Metrics Chart for Selected Models */}
          {selectedData.length >= 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Visual Comparison</h2>
              <GranularErrorBoundary name="Metrics Chart">
                <MetricsChart
                  models={selectedData.map((m) => m.model)}
                  scores={Object.fromEntries(selectedData.map((m) => [m.model.id, m.scores]))}
                />
              </GranularErrorBoundary>
            </div>
          )}

          {/* Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Filter Models</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterBar
                providers={providers}
                architectures={architectures}
                tags={tags}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Model Comparison ({filteredModels.length} models)
            </h2>
            <ModelComparisonTable
              models={filteredModels}
              selectedModelIds={selectedModelIds}
              onSelectedModelsChange={handleSelectedModelsChange}
            />
          </div>

          {/* All Models Grid */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">All Models</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModels.map(({ model, scores }) => (
                <GranularErrorBoundary key={model.id} name={model.name}>
                  <ModelCard model={model} scores={scores} />
                </GranularErrorBoundary>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
