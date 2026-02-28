'use client'

import { useState, useMemo } from 'react'
import { Model, BenchmarkScores } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ModelCard, FilterBar, ModelComparisonTable } from '@/components/features'

interface HomeClientProps {
  initialModels: Array<{ model: Model; scores: BenchmarkScores }>
  providers: string[]
  architectures: string[]
  tags: string[]
}

export function HomeClient({ initialModels, providers, architectures, tags }: HomeClientProps) {
  const [filters, setFilters] = useState({
    search: '',
    providers: [] as string[],
    architectures: [] as string[],
    tags: [] as string[],
  })

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold">Model Arena</h1>
          <p className="text-muted-foreground mt-1">
            Compare AI models across multiple leaderboards
          </p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="space-y-8">
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

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Model Comparison ({filteredModels.length} models)
            </h2>
            <ModelComparisonTable models={filteredModels} />
          </div>

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
