export interface BenchmarkSource {
  name: 'Chatbot Arena' | 'ArtificialAnalysis' | 'LiveCodeBench' | 'SWE-bench'
  lastUpdated: string
}

export interface ArenaScore {
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

export interface ArtificialAnalysisScore {
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

export interface LiveCodeBenchScore {
  passAt1: number
  passAt5: number
  passAt10: number
}

export interface SWEBenchScore {
  score: number
  testsTotal: number
  testsPassed: number
}

export type BenchmarkScores = {
  arena?: ArenaScore
  artificialAnalysis?: ArtificialAnalysisScore
  liveCodeBench?: LiveCodeBenchScore
  swebench?: SWEBenchScore
}
