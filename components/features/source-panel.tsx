import { Card, CardContent, CardHeader, CardTitle, Badge, DataFreshnessTag } from '@/components/ui'
import { ExternalLink } from 'lucide-react'

interface SourceInfo {
  name: string
  description: string
  methodology: string
  lastUpdated: string
  url: string
  metrics: string[]
}

interface SourcePanelProps {
  sources: SourceInfo[]
  className?: string
}

const defaultSources: SourceInfo[] = [
  {
    name: 'Chatbot Arena',
    description: 'Crowdsourced LLM benchmark by LMSYS Org',
    methodology: 'Elo rating system based on pairwise human voting on model outputs',
    lastUpdated: '2024-07-31',
    url: 'https://chat.lmsys.org',
    metrics: [
      'Overall ELO',
      'Coding',
      'Math',
      'Reasoning',
      'Instruction Following',
      'Creativity',
      'Safety',
    ],
  },
  {
    name: 'ArtificialAnalysis',
    description: 'Independent AI model evaluation platform',
    methodology: 'Automated benchmark suite measuring quality, speed, and intelligence',
    lastUpdated: '2024-08-01',
    url: 'https://artificialanalysis.ai',
    metrics: ['Quality Index', 'Tokens/sec', 'Intelligence Score', 'Pricing'],
  },
  {
    name: 'LiveCodeBench',
    description: 'Continuously updated coding benchmark',
    methodology: 'Pass@k evaluation on competitive programming problems',
    lastUpdated: '2024-07-15',
    url: 'https://livecodebench.github.io',
    metrics: ['Pass@1', 'Pass@5', 'Pass@10'],
  },
  {
    name: 'SWE-bench',
    description: 'Software engineering benchmark for code generation',
    methodology: 'Models resolve real GitHub issues from popular repositories',
    lastUpdated: '2024-06-01',
    url: 'https://www.swebench.com',
    metrics: ['Solve Rate', 'Tests Passed', 'Total Tests'],
  },
]

export function SourcePanel({ sources = defaultSources, className }: SourcePanelProps) {
  return (
    <div className={className}>
      <h2 className="text-lg font-semibold mb-4">Benchmark Sources</h2>
      <div className="space-y-4">
        {sources.map((source) => (
          <Card key={source.name}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{source.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{source.description}</p>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <DataFreshnessTag lastUpdated={source.lastUpdated} />

              <div>
                <h4 className="text-sm font-medium mb-1">Methodology</h4>
                <p className="text-sm text-muted-foreground">{source.methodology}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Metrics</h4>
                <div className="flex flex-wrap gap-1">
                  {source.metrics.map((metric) => (
                    <Badge key={metric} variant="outline" className="text-xs">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
