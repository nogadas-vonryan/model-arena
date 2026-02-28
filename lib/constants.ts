/**
 * Application-wide constants
 */

/** Maximum number of models that can be compared at once */
export const MAX_MODEL_SELECTION = 4

/** Minimum number of comparison slots shown in QuickCompare */
export const MIN_COMPARISON_SLOTS = 2

/** Default revalidation interval for model data (in seconds) */
export const REVALIDATE_MODELS_INTERVAL = 3600

/** Default revalidation interval for health check (in seconds) */
export const REVALIDATE_HEALTH_INTERVAL = 60

/** Valid source identifiers for API filtering */
export const VALID_SOURCES = ['arena', 'aa', 'livecode', 'swebench'] as const

export type SourceId = (typeof VALID_SOURCES)[number]

/** Source metadata for UI display */
export const SOURCE_INFO: Record<SourceId, { name: string; description: string; url: string }> = {
  arena: {
    name: 'Chatbot Arena',
    description: 'Crowdsourced LLM battles (ELO)',
    url: 'https://lmarena.ai',
  },
  aa: {
    name: 'ArtificialAnalysis',
    description: 'Quality, speed & intelligence scores',
    url: 'https://artificialanalysis.ai',
  },
  livecode: {
    name: 'LiveCodeBench',
    description: 'Code generation benchmark',
    url: 'https://livecodebench.github.io',
  },
  swebench: {
    name: 'SWE-bench',
    description: 'Real-world software engineering tasks',
    url: 'https://www.swebench.com',
  },
}
