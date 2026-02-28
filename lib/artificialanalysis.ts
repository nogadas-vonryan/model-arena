import { cache } from "react";
import artificialAnalysisData from "@/data/artificialanalysis.json";
import { ArtificialAnalysisScore, BenchmarkSource } from "@/types/benchmarks";

export interface ArtificialAnalysisEntry {
  model: string;
  quality: number;
  speed: number;
  intelligence: number;
  pricing: {
    input: number;
    output: number;
    cacheWrite: number;
    cacheRead: number;
  };
}

export interface ArtificialAnalysisData {
  lastUpdated: string;
  source: string;
  data: ArtificialAnalysisEntry[];
}

const getArtificialAnalysisDataCached = cache(async (): Promise<ArtificialAnalysisData> => {
  return artificialAnalysisData as ArtificialAnalysisData;
});

export async function getArtificialAnalysisData(): Promise<ArtificialAnalysisData> {
  return getArtificialAnalysisDataCached();
}

export function getAAScoresForModel(
  modelId: string,
  data: ArtificialAnalysisData
): ArtificialAnalysisScore | undefined {
  const normalizedModelId = modelId.toLowerCase();

  const entry = data.data.find(
    (e) =>
      e.model.toLowerCase().includes(normalizedModelId) ||
      normalizedModelId.includes(e.model.toLowerCase().split("-")[0])
  );

  if (!entry) return undefined;

  return {
    quality: entry.quality,
    speed: entry.speed,
    intelligence: entry.intelligence,
    pricing: entry.pricing,
  };
}

export function getAASource(): BenchmarkSource {
  return {
    name: "ArtificialAnalysis",
    lastUpdated: (artificialAnalysisData as ArtificialAnalysisData).lastUpdated,
  };
}
