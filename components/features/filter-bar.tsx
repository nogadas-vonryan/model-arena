"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  providers: string[];
  architectures: string[];
  tags: string[];
  onFilterChange: (filters: {
    search: string;
    providers: string[];
    architectures: string[];
    tags: string[];
  }) => void;
}

export function FilterBar({
  providers,
  architectures,
  tags,
  onFilterChange,
}: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedArchitectures, setSelectedArchitectures] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleFilter = (
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newFilters = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setter(newFilters);
    notifyChange(search, newFilters, selectedArchitectures, selectedTags);
  };

  const notifyChange = (
    searchValue: string,
    provs: string[],
    archs: string[],
    tgs: string[]
  ) => {
    onFilterChange({
      search: searchValue,
      providers: provs,
      architectures: archs,
      tags: tgs,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedProviders([]);
    setSelectedArchitectures([]);
    setSelectedTags([]);
    onFilterChange({
      search: "",
      providers: [],
      architectures: [],
      tags: [],
    });
  };

  const hasFilters =
    search ||
    selectedProviders.length > 0 ||
    selectedArchitectures.length > 0 ||
    selectedTags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search models..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            notifyChange(
              e.target.value,
              selectedProviders,
              selectedArchitectures,
              selectedTags
            );
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
              variant={selectedProviders.includes(provider) ? "default" : "outline"}
              className="cursor-pointer mr-1"
              onClick={() => toggleFilter(provider, selectedProviders, setSelectedProviders)}
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
              variant={selectedArchitectures.includes(arch) ? "default" : "outline"}
              className="cursor-pointer mr-1"
              onClick={() => toggleFilter(arch, selectedArchitectures, setSelectedArchitectures)}
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
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer mr-1"
              onClick={() => toggleFilter(tag, selectedTags, setSelectedTags)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
