import { BenchmarkSource, BenchmarkScores, Model } from './index'

export interface HealthResponse {
  status: 'healthy' | 'degraded'
  timestamp: string
  dataSources: {
    chatbotArena: { status: 'ok' | 'error'; lastUpdated?: string; error?: string }
    artificialAnalysis: { status: 'ok' | 'error'; lastUpdated?: string; error?: string }
    liveCodeBench: { status: 'ok' | 'error'; lastUpdated?: string; error?: string }
    swebench: { status: 'ok' | 'error'; lastUpdated?: string; error?: string }
  }
}

export interface ModelsListResponse {
  models: Array<{
    model: Model
    hasArenaScore: boolean
    hasAAScore: boolean
    hasLiveCodeScore: boolean
    hasSWEScore: boolean
  }>
  total: number
  filters: {
    providers: string[]
    architectures: string[]
    tags: string[]
  }
}

export interface ModelBenchmarksResponse {
  model: Model
  scores: BenchmarkScores
  sources: BenchmarkSource[]
}

export interface CompareResponse {
  models: Array<{
    model: Model
    scores: BenchmarkScores
  }>
  sources: BenchmarkSource[]
  requestedModelIds: string[]
  missingModelIds: string[]
}

export interface ErrorResponse {
  error: string
  message: string
  statusCode: number
}

export interface RevalidateRequest {
  secret: string
  source: 'hf' | 'aa' | 'all'
}

export interface RevalidateResponse {
  success: boolean
  revalidated: string[]
  message: string
}

export interface ArenaAPIResponse {
  arena: BenchmarkSource
  data: ArenaAPIEntry[]
}

export interface ArenaAPIEntry {
  model: string
  organization: string
  license: string
  overall_score: number
  coding_score: number
  math_score: number
  reasoning_score: number
  if_score: number
  creativity_score: number
  safety_score: number
  votes: number
  vote_percent: number
}

export interface ArtificialAnalysisAPIResponse {
  models: ArtificialAnalysisAPIEntry[]
  last_updated: string
}

export interface ArtificialAnalysisAPIEntry {
  model_id: string
  name: string
  context_length: number
  input_cost_per_mtok: number
  output_cost_per_mtok: number
  quality_score: number
  speed_score: number
  intelligence_score: number
  release_date: string
}
