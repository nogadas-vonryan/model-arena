import { NextRequest, NextResponse } from 'next/server'
import { getModelWithBenchmarks } from '@/lib/models'
import { getArenaSource } from '@/lib/hf-leaderboard'
import { getAASource } from '@/lib/artificialanalysis'
import { getLiveCodeSwebenchSource } from '@/lib/data-merger'
import type { CompareResponse, ErrorResponse } from '@/types/api'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const ALL_SOURCES = [
  { id: 'arena', getter: getArenaSource },
  { id: 'aa', getter: getAASource },
  { id: 'livecode', getter: getLiveCodeSwebenchSource },
]

export async function GET(
  request: NextRequest
): Promise<NextResponse<CompareResponse | ErrorResponse>> {
  const { searchParams } = new URL(request.url)

  const modelIdsParam = searchParams.get('modelIds')
  const sourcesParam = searchParams.get('sources')

  if (!modelIdsParam) {
    return NextResponse.json(
      {
        error: 'Bad Request',
        message: 'modelIds query parameter is required',
        statusCode: 400,
      },
      { status: 400 }
    )
  }

  const modelIds = modelIdsParam.split(',').map((id) => id.trim())

  if (modelIds.length > 4) {
    return NextResponse.json(
      {
        error: 'Bad Request',
        message: 'Maximum 4 models can be compared at once',
        statusCode: 400,
      },
      { status: 400 }
    )
  }

  const requestedModelIds = modelIds
  const missingModelIds: string[] = []

  const modelsResult = await Promise.all(
    modelIds.map(async (modelId) => {
      const result = await getModelWithBenchmarks(modelId)
      if (!result) {
        missingModelIds.push(modelId)
        return null
      }
      return result
    })
  )

  const models = modelsResult.filter((r): r is NonNullable<typeof r> => r !== null)

  if (models.length === 0) {
    return NextResponse.json(
      {
        error: 'Not Found',
        message: 'None of the requested models were found',
        statusCode: 404,
      },
      { status: 404 }
    )
  }

  let sources = ALL_SOURCES.map((s) => s.getter())

  if (sourcesParam) {
    const requestedSources = sourcesParam.split(',').map((s) => s.trim())
    const sourceMap: Record<string, (typeof ALL_SOURCES)[number]> = {
      arena: ALL_SOURCES[0],
      aa: ALL_SOURCES[1],
      livecode: ALL_SOURCES[2],
    }
    sources = requestedSources
      .map((id) => sourceMap[id])
      .filter(Boolean)
      .map((s) => s!.getter())
  }

  return NextResponse.json({
    models,
    sources,
    requestedModelIds,
    missingModelIds,
  })
}
