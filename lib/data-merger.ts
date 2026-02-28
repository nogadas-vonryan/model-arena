import { cache } from 'react'
import liveCodeSwebenchData from '@/data/livecode-swebench.json'
import { LiveCodeBenchScore, SWEBenchScore, BenchmarkSource } from '@/types/benchmarks'

export interface LiveCodeBenchEntry {
  model: string
  passAt1: number
  passAt5: number
  passAt10: number
}

export interface SWEBenchEntry {
  model: string
  score: number
  testsTotal: number
  testsPassed: number
}

export interface LiveCodeSwebenchData {
  lastUpdated: string
  source: string
  liveCodeBench: LiveCodeBenchEntry[]
  swebench: SWEBenchEntry[]
}

const getLiveCodeSwebenchDataCached = cache(async (): Promise<LiveCodeSwebenchData> => {
  return liveCodeSwebenchData as LiveCodeSwebenchData
})

export async function getLiveCodeSwebenchData(): Promise<LiveCodeSwebenchData> {
  return getLiveCodeSwebenchDataCached()
}

export function getLiveCodeBenchScoresForModel(
  modelId: string,
  data: LiveCodeSwebenchData
): LiveCodeBenchScore | undefined {
  const normalizedModelId = modelId.toLowerCase()

  // First try exact match
  let entry = data.liveCodeBench.find((e) => e.model.toLowerCase() === normalizedModelId)

  // Try partial match but ensure it's a proper prefix match
  if (!entry) {
    entry = data.liveCodeBench.find((e) => {
      const entryModel = e.model.toLowerCase()
      if (normalizedModelId.startsWith(entryModel)) return true
      if (entryModel.startsWith(normalizedModelId)) {
        const nextChar = entryModel[normalizedModelId.length]
        if (!nextChar || nextChar === '-' || nextChar === '.') return true
      }
      return false
    })
  }

  if (!entry) return undefined

  return {
    passAt1: entry.passAt1,
    passAt5: entry.passAt5,
    passAt10: entry.passAt10,
  }
}

export function getSWEBenchScoresForModel(
  modelId: string,
  data: LiveCodeSwebenchData
): SWEBenchScore | undefined {
  const normalizedModelId = modelId.toLowerCase()

  // First try exact match
  let entry = data.swebench.find((e) => e.model.toLowerCase() === normalizedModelId)

  // Try partial match but ensure it's a proper prefix match
  if (!entry) {
    entry = data.swebench.find((e) => {
      const entryModel = e.model.toLowerCase()
      if (normalizedModelId.startsWith(entryModel)) return true
      if (entryModel.startsWith(normalizedModelId)) {
        const nextChar = entryModel[normalizedModelId.length]
        if (!nextChar || nextChar === '-' || nextChar === '.') return true
      }
      return false
    })
  }

  if (!entry) return undefined

  return {
    score: entry.score,
    testsTotal: entry.testsTotal,
    testsPassed: entry.testsPassed,
  }
}

export function getLiveCodeSwebenchSource(): BenchmarkSource {
  return {
    name: 'LiveCodeBench',
    lastUpdated: (liveCodeSwebenchData as LiveCodeSwebenchData).lastUpdated,
  }
}
