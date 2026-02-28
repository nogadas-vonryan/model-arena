import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getModelWithBenchmarks, getModels } from '@/lib/models'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BenchmarkScoreCard } from '@/components/features'
import { ArrowLeft, Cpu, Calendar, Building } from 'lucide-react'

interface ModelDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const models = await getModels()
  return models.map((model) => ({
    id: model.id,
  }))
}

export default async function ModelDetailPage({ params }: ModelDetailPageProps) {
  const { id } = await params
  const result = await getModelWithBenchmarks(id)

  if (!result) {
    notFound()
  }

  const { model, scores } = result

  const similarModels = (await getModels())
    .filter((m) => m.provider === model.provider && m.id !== id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-6 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold">{model.name}</h1>
              <p className="text-muted-foreground mt-1">{model.description || 'Model details'}</p>
            </div>
            <Link href={`/?modelIds=${id}`}>
              <Button variant="outline">Compare this model</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Model Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Model Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium">{model.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Architecture</p>
                    <p className="font-medium">{model.architecture}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Release Date</p>
                    <p className="font-medium">{model.releaseDate}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">{model.contextWindow.toLocaleString()} context</Badge>
                {model.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benchmark Scores */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Benchmark Scores</h2>
            <BenchmarkScoreCard
              title={model.name}
              arena={scores.arena}
              artificialAnalysis={scores.artificialAnalysis}
              liveCodeBench={scores.liveCodeBench}
              swebench={scores.swebench}
              lastUpdated={new Date().toISOString().split('T')[0]}
            />
          </section>

          {/* Similar Models */}
          {similarModels.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Similar Models</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {similarModels.map((m) => (
                  <Link key={m.id} href={`/models/${m.id}`}>
                    <Card className="hover:bg-muted/30 transition-colors">
                      <CardContent className="pt-4">
                        <h3 className="font-medium">{m.name}</h3>
                        <p className="text-sm text-muted-foreground">{m.architecture}</p>
                        <Badge className="mt-2" variant="outline">
                          {m.contextWindow.toLocaleString()} ctx
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
