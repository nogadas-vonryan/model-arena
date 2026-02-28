'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Model, BenchmarkScores } from '@/types'
import { Card } from '@/components/ui'
import { ChevronDown, X, Plus, Trash2 } from 'lucide-react'

interface QuickCompareProps {
  models: Array<{ model: Model; scores: BenchmarkScores }>
  selectedModelIds: string[]
  onSelectionChange: (ids: string[]) => void
  maxSelection?: number
}

interface ModelDropdownProps {
  models: Array<{ model: Model; scores: BenchmarkScores }>
  selectedId: string | null
  otherSelectedIds: string[]
  onSelect: (modelId: string | null) => void
  onRemove?: () => void
  placeholder: string
  position: number
}

function ModelDropdown({
  models,
  selectedId,
  otherSelectedIds,
  onSelect,
  onRemove,
  placeholder,
  position: _position,
}: ModelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const buttonRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(
    null
  )

  const selectedModel = models.find((m) => m.model.id === selectedId)

  const filteredModels = useMemo(() => {
    return models.filter(({ model }) => {
      if (model.id !== selectedId && otherSelectedIds.includes(model.id)) {
        return false
      }
      if (search) {
        const searchLower = search.toLowerCase()
        return (
          model.name.toLowerCase().includes(searchLower) ||
          model.provider.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [models, selectedId, otherSelectedIds, search])

  const handleSelect = useCallback(
    (modelId: string) => {
      onSelect(modelId)
      setIsOpen(false)
      setSearch('')
      setDropdownPosition(null)
    },
    [onSelect]
  )

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(null)
      setIsOpen(false)
    },
    [onSelect]
  )

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setDropdownPosition(null)
  }, [])

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose()
    } else {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
        })
      }
      setIsOpen(true)
    }
  }, [isOpen, handleClose])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleClose])

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        handleClose()
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOpen, handleClose])

  // Close on resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        handleClose()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, handleClose])

  return (
    <>
      <div
        ref={buttonRef}
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        className={`relative w-[280px] flex-shrink-0 p-4 rounded-lg border transition-all text-left cursor-pointer ${
          selectedModel ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${isOpen ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {selectedModel ? (
              <div>
                <div className="font-semibold truncate">{selectedModel.model.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {selectedModel.model.provider}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">{placeholder}</div>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            {selectedModel && (
              <div
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClear(e as unknown as React.MouseEvent)
                  }
                }}
                className="p-1 hover:bg-primary/20 rounded transition-colors"
                aria-label="Clear selection"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </div>
            )}
            {onRemove && (
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onRemove()
                  }
                }}
                className="p-1 hover:bg-destructive/20 rounded transition-colors text-destructive"
                aria-label="Remove this slot"
                title="Remove this slot"
              >
                <Trash2 className="h-4 w-4" />
              </div>
            )}
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {isOpen && dropdownPosition && (
        <>
          {/* Backdrop - captures all clicks outside */}
          <div className="fixed inset-0 z-40" onClick={handleClose} />

          {/* Dropdown - positioned below the clicked button */}
          <div
            className="fixed z-50 w-[320px] max-w-[90vw] pointer-events-auto"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${Math.max(16, dropdownPosition.left)}px`,
              maxHeight: 'min(50vh, 400px)',
            }}
          >
            <Card className="shadow-xl border-primary/20 overflow-hidden flex flex-col h-full">
              <div className="p-3 border-b flex-shrink-0 bg-background">
                <input
                  type="text"
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto flex-1 bg-background min-h-0">
                {filteredModels.length > 0 ? (
                  filteredModels.map(({ model, scores }) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleSelect(model.id)}
                      className="w-full p-3 text-left hover:bg-primary/5 transition-colors border-b last:border-b-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{model.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {model.provider} • {model.architecture}
                          </div>
                        </div>
                        {scores.arena && (
                          <div className="ml-2 text-xs font-medium text-primary whitespace-nowrap">
                            Arena: {Math.round(scores.arena.overall)}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No models found</div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  )
}

export function QuickCompare({
  models,
  selectedModelIds,
  onSelectionChange,
  maxSelection = 4,
}: QuickCompareProps) {
  // Track number of slots (min 2, max maxSelection)
  const [slotCount, setSlotCount] = useState(2)

  const handleModelSelect = useCallback(
    (position: number, modelId: string | null) => {
      const current = [...selectedModelIds]

      if (modelId === null) {
        // Clear this position
        current.splice(position, 1)
      } else {
        // Check if this model is already selected
        if (current.includes(modelId)) {
          return // Don't allow duplicate
        }
        // Add or replace at position
        if (position < current.length) {
          current[position] = modelId
        } else {
          current.push(modelId)
        }
      }

      onSelectionChange(current.slice(0, maxSelection))
    },
    [selectedModelIds, onSelectionChange, maxSelection]
  )

  const handleAddSlot = useCallback(() => {
    if (slotCount < maxSelection) {
      setSlotCount(slotCount + 1)
    }
  }, [slotCount, maxSelection])

  const handleRemoveSlot = useCallback(
    (index: number) => {
      const newSelection = [...selectedModelIds]
      newSelection.splice(index, 1)
      onSelectionChange(newSelection)
      if (slotCount > 2) {
        setSlotCount(slotCount - 1)
      }
    },
    [selectedModelIds, onSelectionChange, slotCount]
  )

  // Create dropdown slots
  const dropdowns = []

  for (let i = 0; i < slotCount; i++) {
    const modelId = selectedModelIds[i] || null

    dropdowns.push(
      <ModelDropdown
        key={i}
        models={models}
        selectedId={modelId}
        otherSelectedIds={selectedModelIds.filter((id, idx) => idx !== i)}
        onSelect={(modelId) => handleModelSelect(i, modelId)}
        placeholder={i === 0 ? 'Select first model' : `Model ${i + 1}`}
        position={i}
        onRemove={slotCount > 2 ? () => handleRemoveSlot(i) : undefined}
      />
    )
  }

  // Add button to add more slots (if under max)
  const canAddMore = slotCount < maxSelection

  return (
    <div className="space-y-4">
      <div className="flex flex-nowrap items-stretch gap-3 justify-center overflow-x-auto pb-2">
        {dropdowns}

        {canAddMore && (
          <button
            type="button"
            onClick={handleAddSlot}
            className="min-w-[60px] h-[76px] rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center flex-shrink-0"
            aria-label="Add another model to compare"
          >
            <Plus className="h-6 w-6 text-muted-foreground" />
          </button>
        )}
      </div>

      {selectedModelIds.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Comparing {selectedModelIds.length} of {maxSelection} models
        </div>
      )}
    </div>
  )
}
