import { getAllModelsWithBenchmarks } from '@/lib/models'
import { getChatbotArenaData } from '@/lib/hf-leaderboard'
import { getArtificialAnalysisData } from '@/lib/artificialanalysis'
import { getLiveCodeSwebenchData } from '@/lib/data-merger'
import { HomeClient } from '@/components/features/home-client'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const modelsWithBenchmarks = await getAllModelsWithBenchmarks()

  const uniqueProviders = [...new Set(modelsWithBenchmarks.map((m) => m.model.provider))]
  const uniqueArchitectures = [...new Set(modelsWithBenchmarks.map((m) => m.model.architecture))]
  const uniqueTags = [...new Set(modelsWithBenchmarks.flatMap((m) => m.model.tags))]

  const [arenaData, aaData, lcsData] = await Promise.all([
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
