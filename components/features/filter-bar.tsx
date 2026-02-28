'use client'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface FilterState {
  search: string
  providers: string[]
  architectures: string[]
  tags: string[]
}

interface FilterBarProps {
  providers: string[]
  architectures: string[]
  tags: string[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function FilterBar({
  providers,
  architectures,
  tags,
  filters,
  onFiltersChange,
}: FilterBarProps) {
  const toggleFilter = (
    value: string,
    current: string[],
    key: keyof Omit<FilterState, 'search'>
  ) => {
    const newFilters = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [key]: newFilters })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      providers: [],
      architectures: [],
      tags: [],
    })
  }

  const hasFilters =
    filters.search ||
    filters.providers.length > 0 ||
    filters.architectures.length > 0 ||
    filters.tags.length > 0

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search models..."
          value={filters.search}
          onChange={(e) => {
            onFiltersChange({ ...filters, search: e.target.value })
          }}
          className="max-w-xs"
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <span className="text-sm font-medium mr-2">Provider:</span>
          {providers.map((provider) => (
            <Badge
              key={provider}
              variant={filters.providers.includes(provider) ? 'default' : 'outline'}
              className="cursor-pointer mr-1"
              onClick={() => toggleFilter(provider, filters.providers, 'providers')}
            >
              {provider}
            </Badge>
          ))}
        </div>

        <div>
          <span className="text-sm font-medium mr-2">Architecture:</span>
          {architectures.map((arch) => (
            <Badge
              key={arch}
              variant={filters.architectures.includes(arch) ? 'default' : 'outline'}
              className="cursor-pointer mr-1"
              onClick={() => toggleFilter(arch, filters.architectures, 'architectures')}
            >
              {arch}
            </Badge>
          ))}
        </div>

        <div>
          <span className="text-sm font-medium mr-2">Tags:</span>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer mr-1"
              onClick={() => toggleFilter(tag, filters.tags, 'tags')}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
