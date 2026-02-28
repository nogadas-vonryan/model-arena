import { BenchmarkSource } from './benchmarks'

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
