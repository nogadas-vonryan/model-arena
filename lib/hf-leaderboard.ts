import { cache } from 'react'
import chatArenaData from '@/data/chatbot-arena.json'
import { ArenaScore, BenchmarkSource } from '@/types/benchmarks'
import { findEntryByModelId } from './utils'

export interface ChatbotArenaEntry {
  model: string
  organization: string
  overall: number
  coding: number
  math: number
  reasoning: number
  instructionFollowing: number
  creativity: number
  safety: number
  votes: number
  votePercent: number
}

export interface ChatbotArenaData {
  lastUpdated: string
  source: string
  data: ChatbotArenaEntry[]
}

const getChatbotArenaDataCached = cache(async (): Promise<ChatbotArenaData> => {
  return chatArenaData as ChatbotArenaData
})

export async function getChatbotArenaData(): Promise<ChatbotArenaData> {
  return getChatbotArenaDataCached()
}

export function getArenaScoresForModel(
  modelId: string,
  data: ChatbotArenaData
): ArenaScore | undefined {
  const entry = findEntryByModelId(modelId, data.data)

  if (!entry) return undefined

  return {
    overall: entry.overall,
    coding: entry.coding,
    math: entry.math,
    reasoning: entry.reasoning,
    instructionFollowing: entry.instructionFollowing,
    creativity: entry.creativity,
    safety: entry.safety,
    votes: entry.votes,
    votePercent: entry.votePercent,
  }
}

export function getArenaSource(): BenchmarkSource {
  return {
    name: 'Chatbot Arena',
    lastUpdated: (chatArenaData as ChatbotArenaData).lastUpdated,
  }
}
