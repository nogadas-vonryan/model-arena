import { Model, BenchmarkScores } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { ScoreBadge } from "@/components/ui/score-badge";
import { formatNumber } from "@/lib/utils";

interface ModelCardProps {
  model: Model;
  scores: BenchmarkScores;
}

export function ModelCard({ model, scores }: ModelCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{model.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{model.provider}</p>
          </div>
          <Badge variant="secondary">{model.architecture}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {model.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Context:</span>{" "}
            <span className="font-medium">{formatNumber(model.contextWindow)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Released:</span>{" "}
            <span className="font-medium">{model.releaseDate}</span>
          </div>
        </div>

        {scores.arena && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Chatbot Arena</span>
              <ScoreBadge score={Math.round(scores.arena.overall)} size="sm" />
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
              <div>Coding: {scores.arena.coding}</div>
              <div>Math: {scores.arena.math}</div>
              <div>Reasoning: {scores.arena.reasoning}</div>
            </div>
          </div>
        )}

        {scores.liveCodeBench && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">LiveCodeBench</span>
              <ScoreBadge score={Math.round(scores.liveCodeBench.passAt1)} size="sm" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
