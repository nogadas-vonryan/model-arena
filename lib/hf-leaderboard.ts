import { cache } from 'react'
import chatArenaData from '@/data/chatbot-arena.json'
import { ArenaScore, BenchmarkSource } from '@/types/benchmarks'

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
  const normalizedModelId = modelId.toLowerCase()

  // First try exact match
  let entry = data.data.find((e) => e.model.toLowerCase() === normalizedModelId)

  // Try matching by full model ID (e.g., "gpt-4o" matches "gpt-4o")
  if (!entry) {
    entry = data.data.find((e) => e.model.toLowerCase() === normalizedModelId)
  }

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
