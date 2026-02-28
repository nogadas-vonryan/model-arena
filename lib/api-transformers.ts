/**
 * API Response Transformers
 *
 * Transforms external API responses to our canonical types.
 * This eliminates type duplication and provides a single source of truth.
 */

import type { ArenaScore, ArtificialAnalysisScore } from '@/types/benchmarks'
import type { ArenaAPIEntry, ArtificialAnalysisAPIEntry } from '@/types/api'

/**
 * Transforms Chatbot Arena API entry to canonical ArenaScore format
 */
export function transformArenaEntry(entry: ArenaAPIEntry): ArenaScore {
  return {
    overall: entry.overall_score,
    coding: entry.coding_score,
    math: entry.math_score,
    reasoning: entry.reasoning_score,
    instructionFollowing: entry.if_score,
    creativity: entry.creativity_score,
    safety: entry.safety_score,
    votes: entry.votes,
    votePercent: entry.vote_percent,
  }
}

/**
 * Transforms array of Arena API entries to canonical format
 */
export function transformArenaEntries(entries: ArenaAPIEntry[]): ArenaScore[] {
  return entries.map(transformArenaEntry)
}

/**
 * Transforms ArtificialAnalysis API entry to canonical format
 */
export function transformArtificialAnalysisEntry(
  entry: ArtificialAnalysisAPIEntry
): ArtificialAnalysisScore {
  return {
    quality: entry.quality_score,
    speed: entry.speed_score,
    intelligence: entry.intelligence_score,
    pricing: {
      input: entry.input_cost_per_mtok,
      output: entry.output_cost_per_mtok,
      cacheWrite: 0, // Not provided by API, default to 0
      cacheRead: 0, // Not provided by API, default to 0
    },
  }
}

/**
 * Transforms array of ArtificialAnalysis API entries to canonical format
 */
export function transformArtificialAnalysisEntries(
  entries: ArtificialAnalysisAPIEntry[]
): ArtificialAnalysisScore[] {
  return entries.map(transformArtificialAnalysisEntry)
}

/**
 * Normalizes model ID from various API formats to our canonical format
 */
export function normalizeModelId(id: string): string {
  return id
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}
