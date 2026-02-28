import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ScoreBadge } from '@/components/ui/score-badge'
import { DataFreshnessTag } from '@/components/ui/data-freshness-tag'
import {
  ArenaScore,
  LiveCodeBenchScore,
  SWEBenchScore,
  ArtificialAnalysisScore,
} from '@/types/benchmarks'

interface BenchmarkScoreCardProps {
  title: string
  arena?: ArenaScore
  liveCodeBench?: LiveCodeBenchScore
  swebench?: SWEBenchScore
  artificialAnalysis?: ArtificialAnalysisScore
  lastUpdated: string
}

export function BenchmarkScoreCard({
  title,
  arena,
  liveCodeBench,
  swebench,
  artificialAnalysis,
  lastUpdated,
}: BenchmarkScoreCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md">{title}</CardTitle>
          <DataFreshnessTag lastUpdated={lastUpdated} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {arena && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Chatbot Arena</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Overall</div>
                <ScoreBadge score={Math.round(arena.overall)} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Coding</div>
                <ScoreBadge score={Math.round(arena.coding)} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Math</div>
                <ScoreBadge score={Math.round(arena.math)} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Reasoning</div>
                <ScoreBadge score={Math.round(arena.reasoning)} />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Votes: {arena.votes.toLocaleString()} ({arena.votePercent}%)
            </div>
          </div>
        )}

        {artificialAnalysis && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium">Artificial Analysis</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Quality</div>
                <ScoreBadge score={artificialAnalysis.quality} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Speed</div>
                <ScoreBadge score={artificialAnalysis.speed} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Intelligence</div>
                <ScoreBadge score={artificialAnalysis.intelligence} />
              </div>
            </div>
          </div>
        )}

        {liveCodeBench && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium">LiveCodeBench</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Pass@1</div>
                <ScoreBadge score={Math.round(liveCodeBench.passAt1)} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Pass@5</div>
                <ScoreBadge score={Math.round(liveCodeBench.passAt5)} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Pass@10</div>
                <ScoreBadge score={Math.round(liveCodeBench.passAt10)} />
              </div>
            </div>
          </div>
        )}

        {swebench && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium">SWE-bench</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Score</div>
                <ScoreBadge score={swebench.score} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Tests</div>
                <div className="text-sm font-medium">
                  {swebench.testsPassed}/{swebench.testsTotal}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
