'use client'

import { useState } from 'react'
import { Model, BenchmarkScores } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, Toggle, Badge } from '@/components/ui'
import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface MetricsChartProps {
  models: Model[]
  scores: Record<string, BenchmarkScores>
}

type ChartType = 'bar' | 'radar'
type ScoreMode = 'raw' | 'normalized'

// Normalize scores to 0-100 scale based on typical max values
function normalizeScore(score: number, source: string): number {
  const maxScores: Record<string, number> = {
    arena: 100,
    artificialAnalysis: 100,
    liveCodeBench: 100,
    swebench: 1, // Already 0-1 scale
  }

  const max = maxScores[source] ?? 100
  return source === 'swebench' ? score * 100 : (score / max) * 100
}

function buildChartData(models: Model[], scores: Record<string, BenchmarkScores>, mode: ScoreMode) {
  // Arena data
  const arenaData = models.map((model) => {
    const arena = scores[model.id]?.arena
    const overall = arena?.overall ?? 0
    return {
      name: model.name,
      Overall: mode === 'normalized' ? normalizeScore(overall, 'arena') : overall,
      Coding:
        mode === 'normalized' ? normalizeScore(arena?.coding ?? 0, 'arena') : (arena?.coding ?? 0),
      Math: mode === 'normalized' ? normalizeScore(arena?.math ?? 0, 'arena') : (arena?.math ?? 0),
      Reasoning:
        mode === 'normalized'
          ? normalizeScore(arena?.reasoning ?? 0, 'arena')
          : (arena?.reasoning ?? 0),
    }
  })

  // LiveCodeBench data
  const liveCodeData = models.map((model) => {
    const lc = scores[model.id]?.liveCodeBench
    const passAt1 = lc?.passAt1 ?? 0
    return {
      name: model.name,
      'Pass@1': mode === 'normalized' ? normalizeScore(passAt1, 'liveCodeBench') : passAt1,
      'Pass@5':
        mode === 'normalized'
          ? normalizeScore(lc?.passAt5 ?? 0, 'liveCodeBench')
          : (lc?.passAt5 ?? 0),
    }
  })

  return { arenaData, liveCodeData }
}

const COLORS = [
  'oklch(41.703% 0.099 251.473)', // primary (blue)
  'oklch(64.092% 0.027 229.389)', // secondary
  'oklch(67.271% 0.167 35.791)', // accent (orange)
  'oklch(70.226% 0.094 156.596)', // success (green)
  'oklch(62.616% 0.143 240.033)', // info
  'oklch(77.482% 0.115 81.519)', // warning (yellow)
]

export function MetricsChart({ models, scores }: MetricsChartProps) {
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [scoreMode, setScoreMode] = useState<ScoreMode>('raw')
  const [activeMetric, setActiveMetric] = useState<'arena' | 'liveCode'>('arena')

  const { arenaData, liveCodeData } = buildChartData(models, scores, scoreMode)
  const data = activeMetric === 'arena' ? arenaData : liveCodeData

  const getUnitLabel = () => {
    if (scoreMode === 'normalized') return '(0-100)'
    return activeMetric === 'arena' ? '(ELO)' : '(%)'
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg">Visual Comparison</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <div className="flex border rounded">
              <Toggle
                pressed={chartType === 'bar'}
                onPressedChange={() => setChartType('bar')}
                size="sm"
              >
                Bar
              </Toggle>
              <Toggle
                pressed={chartType === 'radar'}
                onPressedChange={() => setChartType('radar')}
                size="sm"
              >
                Radar
              </Toggle>
            </div>
            <div className="flex border rounded">
              <Toggle
                pressed={scoreMode === 'raw'}
                onPressedChange={() => setScoreMode('raw')}
                size="sm"
              >
                Raw
              </Toggle>
              <Toggle
                pressed={scoreMode === 'normalized'}
                onPressedChange={() => setScoreMode('normalized')}
                size="sm"
              >
                Normalized
              </Toggle>
            </div>
          </div>
        </div>

        {/* Metric selector */}
        <div className="flex gap-2 mt-3">
          <Badge
            variant={activeMetric === 'arena' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setActiveMetric('arena')}
          >
            Chatbot Arena
          </Badge>
          <Badge
            variant={activeMetric === 'liveCode' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setActiveMetric('liveCode')}
          >
            LiveCodeBench
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {models.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={data}>
                  <CartesianGrid stroke="oklch(0.38778 0.032 261.325)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    stroke="oklch(0.71319 0.015 286.325)"
                    tick={{ fill: 'oklch(0.71319 0.015 286.325)' }}
                  />
                  <YAxis
                    label={{ value: getUnitLabel(), angle: -90, position: 'insideLeft' }}
                    stroke="oklch(0.71319 0.015 286.325)"
                    tick={{ fill: 'oklch(0.71319 0.015 286.325)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.27807 0.027 261.325)',
                      border: '1px solid oklch(0.38778 0.032 261.325)',
                      borderRadius: '0.25rem',
                      color: 'oklch(0.987 0.015 286.325)',
                    }}
                    labelStyle={{ color: 'oklch(0.987 0.015 286.325)' }}
                  />
                  <Legend wrapperStyle={{ color: 'oklch(0.71319 0.015 286.325)' }} />
                  {Object.keys(data[0] ?? {})
                    .filter((key) => key !== 'name')
                    .map((key, index) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={COLORS[index % COLORS.length]}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                </BarChart>
              ) : (
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid stroke="oklch(0.38778 0.032 261.325)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: 'oklch(0.71319 0.015 286.325)' }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 'auto']}
                    tick={{ fill: 'oklch(0.71319 0.015 286.325)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.27807 0.027 261.325)',
                      border: '1px solid oklch(0.38778 0.032 261.325)',
                      borderRadius: '0.25rem',
                      color: 'oklch(0.987 0.015 286.325)',
                    }}
                    labelStyle={{ color: 'oklch(0.987 0.015 286.325)' }}
                  />
                  <Legend wrapperStyle={{ color: 'oklch(0.71319 0.015 286.325)' }} />
                  {Object.keys(data[0] ?? {})
                    .filter((key) => key !== 'name')
                    .map((key, index) => (
                      <Radar
                        key={key}
                        name={key}
                        dataKey={key}
                        stroke={COLORS[index % COLORS.length]}
                        fill={COLORS[index % COLORS.length]}
                        fillOpacity={0.3}
                      />
                    ))}
                </RadarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select models to see the comparison chart
            </div>
          )}
        </div>

        {scoreMode === 'normalized' && (
          <p className="text-xs text-muted-foreground mt-2">
            Normalized scores are scaled to 0-100 based on typical maximum values for each
            benchmark.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
