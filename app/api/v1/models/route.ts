import { NextRequest, NextResponse } from 'next/server'
import { getAllModelsWithBenchmarks } from '@/lib/models'
import type { ModelsListResponse, ErrorResponse } from '@/types/api'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET(
  request: NextRequest
): Promise<NextResponse<ModelsListResponse | ErrorResponse>> {
  const { searchParams } = new URL(request.url)

  const provider = searchParams.get('provider')
  const architecture = searchParams.get('architecture')
  const tags = searchParams.get('tags')
  const search = searchParams.get('search')

  const modelsWithBenchmarks = await getAllModelsWithBenchmarks()

  const filtered = modelsWithBenchmarks.filter(({ model, scores: _scores }) => {
    if (provider && model.provider !== provider) return false
    if (architecture && model.architecture !== architecture) return false
    if (tags) {
      const tagList = tags.split(',')
      if (!tagList.some((t) => model.tags.includes(t))) return false
    }
    if (search) {
      const searchLower = search.toLowerCase()
      const matchesName = model.name.toLowerCase().includes(searchLower)
      const matchesProvider = model.provider.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesProvider) return false
    }
    return true
  })

  const models = filtered.map(({ model, scores }) => ({
    model,
    hasArenaScore: !!scores.arena,
    hasAAScore: !!scores.artificialAnalysis,
    hasLiveCodeScore: !!scores.liveCodeBench,
    hasSWEScore: !!scores.swebench,
  }))

  const providers = [...new Set(modelsWithBenchmarks.map((m) => m.model.provider))]
  const architectures = [...new Set(modelsWithBenchmarks.map((m) => m.model.architecture))]
  const tagsSet = new Set<string>()
  modelsWithBenchmarks.forEach((m) => m.model.tags.forEach((t) => tagsSet.add(t)))
  const tagsList = [...tagsSet]

  return NextResponse.json({
    models,
    total: models.length,
    filters: {
      providers,
      architectures,
      tags: tagsList,
    },
  })
}
