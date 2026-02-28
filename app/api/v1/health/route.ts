import { NextResponse } from 'next/server'
import { getChatbotArenaData } from '@/lib/hf-leaderboard'
import { getArtificialAnalysisData } from '@/lib/artificialanalysis'
import { getLiveCodeSwebenchData } from '@/lib/data-merger'
import type { HealthResponse } from '@/types/api'

export const dynamic = 'force-dynamic'
export const revalidate = 60

async function checkDataSource(
  name: 'chatbotArena' | 'artificialAnalysis' | 'liveCodeBench',
  fetcher: () => Promise<{ lastUpdated?: string }>
): Promise<{ status: 'ok' | 'error'; lastUpdated?: string; error?: string }> {
  try {
    const data = await fetcher()
    return {
      status: 'ok',
      lastUpdated: data.lastUpdated,
    }
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const [arena, aa, lcs] = await Promise.all([
    checkDataSource('chatbotArena', async () => {
      const data = await getChatbotArenaData()
      return { lastUpdated: data.lastUpdated }
    }),
    checkDataSource('artificialAnalysis', async () => {
      const data = await getArtificialAnalysisData()
      return { lastUpdated: data.lastUpdated }
    }),
    checkDataSource('liveCodeBench', async () => {
      const data = await getLiveCodeSwebenchData()
      return { lastUpdated: data.lastUpdated }
    }),
  ])

  const sources = {
    chatbotArena: arena,
    artificialAnalysis: aa,
    liveCodeBench: lcs,
    swebench: lcs,
  }

  const hasErrors = Object.values(sources).some((s) => s.status === 'error')
  const status: HealthResponse['status'] = hasErrors ? 'degraded' : 'healthy'

  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    dataSources: sources,
  })
}
