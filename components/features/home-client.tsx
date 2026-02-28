'use client'

import { useState, useMemo } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { Model, BenchmarkScores } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, DataFreshnessTag } from '@/components/ui'
import {
  ModelCard,
  FilterBar,
  ModelComparisonTable,
  MetricsChart,
  QuickCompare,
} from '@/components/features'
import { Trophy, BarChart3, Code, Brain } from 'lucide-react'

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

const SOURCE_INFO: Record<
  string,
  { name: string; description: string; icon: React.ElementType; url: string }
> = {
  arena: {
    name: 'Chatbot Arena',
    description: 'Crowdsourced LLM battles (ELO)',
    icon: Trophy,
    url: 'https://lmarena.ai',
  },
  aa: {
    name: 'ArtificialAnalysis',
    description: 'Quality, speed & intelligence scores',
    icon: BarChart3,
    url: 'https://artificialanalysis.ai',
  },
  livecode: {
    name: 'LiveCodeBench',
    description: 'Code generation benchmark',
    icon: Code,
    url: 'https://livecodebench.github.io',
  },
  swebench: {
    name: 'SWE-bench',
    description: 'Real-world software engineering tasks',
    icon: Brain,
    url: 'https://www.swebench.com',
  },
}

export function HomeClient({
  initialModels,
  providers,
  architectures,
  tags,
  sources,
}: HomeClientProps) {
  const [filters, setFilters] = useState({
    search: '',
    providers: [] as string[],
    architectures: [] as string[],
    tags: [] as string[],
  })

  const [selectedModelIdsRaw, setSelectedModelIdsRaw] = useQueryState(
    'modelIds',
    parseAsString.withOptions({ clearOnDefault: true })
  )

  // Parse model IDs from URL
  const urlModelIds = (selectedModelIdsRaw || '').split(',').filter(Boolean).slice(0, 4)

  // For the UI, we always show at least 2 slots, plus any selected models
  const selectedModelIds = urlModelIds

  const handleSelectedModelsChange = (ids: string[]) => {
    // Filter out empty strings and save to URL
    const nonEmptyIds = ids.filter(Boolean).slice(0, 4)
    setSelectedModelIdsRaw(nonEmptyIds.join(','))
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
                const info = SOURCE_INFO[source.id]
                if (!info) return null
                const Icon = info.icon
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
              maxSelection={4}
            />
          </section>

          {/* Metrics Chart for Selected Models */}
          {selectedData.length >= 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Visual Comparison</h2>
              <MetricsChart
                models={selectedData.map((m) => m.model)}
                scores={Object.fromEntries(selectedData.map((m) => [m.model.id, m.scores]))}
              />
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
                onFilterChange={setFilters}
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
                <ModelCard key={model.id} model={model} scores={scores} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
