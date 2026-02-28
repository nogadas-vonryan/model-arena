import { cache } from 'react'
import modelsData from '@/data/models.json'
import { Model } from '@/types/models'
import { BenchmarkScores } from '@/types/benchmarks'
import { getChatbotArenaData, getArenaScoresForModel } from './hf-leaderboard'
import { getArtificialAnalysisData, getAAScoresForModel } from './artificialanalysis'
import {
  getLiveCodeSwebenchData,
  getLiveCodeBenchScoresForModel,
  getSWEBenchScoresForModel,
} from './data-merger'

const getModelsCached = cache(async (): Promise<Model[]> => {
  return modelsData as Model[]
})

export async function getModels(): Promise<Model[]> {
  return getModelsCached()
}

export async function getModelById(id: string): Promise<Model | undefined> {
  const models = await getModels()
  return models.find((m) => m.id === id)
}

export async function getModelWithBenchmarks(
  modelId: string
): Promise<{ model: Model; scores: BenchmarkScores } | null> {
  const model = await getModelById(modelId)
  if (!model) return null

  const [arenaData, aaData, lcsData] = await Promise.all([
    getChatbotArenaData(),
    getArtificialAnalysisData(),
    getLiveCodeSwebenchData(),
  ])

  const scores: BenchmarkScores = {
    arena: getArenaScoresForModel(modelId, arenaData),
    artificialAnalysis: getAAScoresForModel(modelId, aaData),
    liveCodeBench: getLiveCodeBenchScoresForModel(modelId, lcsData),
    swebench: getSWEBenchScoresForModel(modelId, lcsData),
  }

  return { model, scores }
}

export async function getAllModelsWithBenchmarks(): Promise<
  Array<{ model: Model; scores: BenchmarkScores }>
> {
  const models = await getModels()

  const [arenaData, aaData, lcsData] = await Promise.all([
    getChatbotArenaData(),
    getArtificialAnalysisData(),
    getLiveCodeSwebenchData(),
  ])

  return models.map((model) => ({
    model,
    scores: {
      arena: getArenaScoresForModel(model.id, arenaData),
      artificialAnalysis: getAAScoresForModel(model.id, aaData),
      liveCodeBench: getLiveCodeBenchScoresForModel(model.id, lcsData),
      swebench: getSWEBenchScoresForModel(model.id, lcsData),
    },
  }))
}
