import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateRelative(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

/**
 * Finds a matching entry by model ID with fallback to prefix matching.
 * Handles cases like "gpt-4o" matching "gpt-4o" but not "gpt-5-2-chat".
 *
 * @param modelId - The model ID to search for
 * @param entries - Array of entries with a model property
 * @returns The matching entry or undefined
 */
export function findEntryByModelId<T extends { model: string }>(
  modelId: string,
  entries: T[]
): T | undefined {
  const normalizedModelId = modelId.toLowerCase()

  // First try exact match
  let entry = entries.find((e) => e.model.toLowerCase() === normalizedModelId)

  // Try partial match with proper prefix checking
  if (!entry) {
    entry = entries.find((e) => {
      const entryModel = e.model.toLowerCase()
      if (normalizedModelId.startsWith(entryModel)) return true
      if (entryModel.startsWith(normalizedModelId)) {
        const nextChar = entryModel[normalizedModelId.length]
        if (!nextChar || nextChar === '-' || nextChar === '.') return true
      }
      return false
    })
  }

  return entry
}

/**
 * Validates and sanitizes a model ID
 * Model IDs should only contain alphanumeric characters, hyphens, and dots
 */
export function isValidModelId(modelId: string): boolean {
  if (!modelId || typeof modelId !== 'string') return false
  if (modelId.length > 100) return false
  return /^[a-zA-Z0-9.-]+$/.test(modelId)
}

/**
 * Sanitizes a model ID by removing potentially dangerous characters
 */
export function sanitizeModelId(modelId: string): string {
  return modelId.replace(/[^a-zA-Z0-9.-]/g, '').slice(0, 100)
}

/**
 * Validates an array of model IDs
 * Returns an object with valid IDs and any invalid IDs found
 */
export function validateModelIds(modelIds: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = []
  const invalid: string[] = []

  for (const id of modelIds) {
    if (isValidModelId(id)) {
      valid.push(id)
    } else {
      invalid.push(id)
    }
  }

  return { valid, invalid }
}
