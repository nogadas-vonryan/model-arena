import { getAllModelsWithBenchmarks } from "@/lib/models";
import { HomeClient } from "@/components/features/home-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const modelsWithBenchmarks = await getAllModelsWithBenchmarks();

  const uniqueProviders = [...new Set(modelsWithBenchmarks.map((m) => m.model.provider))];
  const uniqueArchitectures = [...new Set(modelsWithBenchmarks.map((m) => m.model.architecture))];
  const uniqueTags = [...new Set(modelsWithBenchmarks.flatMap((m) => m.model.tags))];

  return (
    <HomeClient
      initialModels={modelsWithBenchmarks}
      providers={uniqueProviders}
      architectures={uniqueArchitectures}
      tags={uniqueTags}
    />
  );
}
