import { cache } from 'react'
import { getAllModelsWithBenchmarks } from '@/lib/models'
import { getChatbotArenaData } from '@/lib/hf-leaderboard'
import { getArtificialAnalysisData } from '@/lib/artificialanalysis'
import { getLiveCodeSwebenchData } from '@/lib/data-merger'
import { HomeClient } from '@/components/features/home-client'

export const dynamic = 'force-dynamic'

// Cache the filter options computation for the request lifetime
const getFilterOptions = cache(async () => {
  const modelsWithBenchmarks = await getAllModelsWithBenchmarks()

  return {
    modelsWithBenchmarks,
    uniqueProviders: [...new Set(modelsWithBenchmarks.map((m) => m.model.provider))],
    uniqueArchitectures: [...new Set(modelsWithBenchmarks.map((m) => m.model.architecture))],
    uniqueTags: [...new Set(modelsWithBenchmarks.flatMap((m) => m.model.tags))],
  }
})

export default async function Home() {
  const [
    { modelsWithBenchmarks, uniqueProviders, uniqueArchitectures, uniqueTags },
    arenaData,
    aaData,
    lcsData,
  ] = await Promise.all([
    getFilterOptions(),
    getChatbotArenaData(),
    getArtificialAnalysisData(),
    getLiveCodeSwebenchData(),
  ])

  const sources = [
    { id: 'arena', lastUpdated: arenaData.lastUpdated },
    { id: 'aa', lastUpdated: aaData.lastUpdated },
    { id: 'livecode', lastUpdated: lcsData.lastUpdated },
    { id: 'swebench', lastUpdated: lcsData.lastUpdated },
  ]

  return (
    <HomeClient
      initialModels={modelsWithBenchmarks}
      providers={uniqueProviders}
      architectures={uniqueArchitectures}
      tags={uniqueTags}
      sources={sources}
    />
  )
}
