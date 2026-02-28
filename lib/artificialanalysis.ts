import { cache } from 'react'
import artificialAnalysisData from '@/data/artificialanalysis.json'
import { ArtificialAnalysisScore, BenchmarkSource } from '@/types/benchmarks'

export interface ArtificialAnalysisEntry {
  model: string
  quality: number
  speed: number
  intelligence: number
  pricing: {
    input: number
    output: number
    cacheWrite: number
    cacheRead: number
  }
}

export interface ArtificialAnalysisData {
  lastUpdated: string
  source: string
  data: ArtificialAnalysisEntry[]
}

const getArtificialAnalysisDataCached = cache(async (): Promise<ArtificialAnalysisData> => {
  return artificialAnalysisData as ArtificialAnalysisData
})

export async function getArtificialAnalysisData(): Promise<ArtificialAnalysisData> {
  return getArtificialAnalysisDataCached()
}

export function getAAScoresForModel(
  modelId: string,
  data: ArtificialAnalysisData
): ArtificialAnalysisScore | undefined {
  const normalizedModelId = modelId.toLowerCase()

  // First try exact match
  let entry = data.data.find((e) => e.model.toLowerCase() === normalizedModelId)

  // Try partial match but ensure it's a proper prefix match
  // e.g., "gpt-4o" should match "gpt-4o" but not "gpt-5-2-chat"
  if (!entry) {
    entry = data.data.find((e) => {
      const entryModel = e.model.toLowerCase()
      // Check if model ID starts with the entry model name
      if (normalizedModelId.startsWith(entryModel)) return true
      // Check if entry model starts with the model ID (for shorter IDs)
      if (entryModel.startsWith(normalizedModelId)) {
        // Ensure the next char is a separator or end of string
        const nextChar = entryModel[normalizedModelId.length]
        if (!nextChar || nextChar === '-' || nextChar === '.') return true
      }
      return false
    })
  }

  if (!entry) return undefined

  return {
    quality: entry.quality,
    speed: entry.speed,
    intelligence: entry.intelligence,
    pricing: entry.pricing,
  }
}

export function getAASource(): BenchmarkSource {
  return {
    name: 'ArtificialAnalysis',
    lastUpdated: (artificialAnalysisData as ArtificialAnalysisData).lastUpdated,
  }
}
