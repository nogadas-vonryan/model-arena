import { NextResponse } from 'next/server'
import { getModelWithBenchmarks } from '@/lib/models'
import { getArenaSource } from '@/lib/hf-leaderboard'
import { getAASource } from '@/lib/artificialanalysis'
import { getLiveCodeSwebenchSource } from '@/lib/data-merger'
import { isValidModelId } from '@/lib/utils'
import type { ModelBenchmarksResponse, ErrorResponse } from '@/types/api'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET(
  request: Request,
  { params }: { params: Promise<{ modelId: string }> }
): Promise<NextResponse<ModelBenchmarksResponse | ErrorResponse>> {
  const { modelId } = await params

  // Validate model ID format
  if (!isValidModelId(modelId)) {
    return NextResponse.json(
      {
        error: 'Bad Request',
        message: 'Invalid model ID format',
        statusCode: 400,
      },
      { status: 400 }
    )
  }

  const result = await getModelWithBenchmarks(modelId)

  if (!result) {
    return NextResponse.json(
      {
        error: 'Not Found',
        message: `Model with id '${modelId}' not found`,
        statusCode: 404,
      },
      { status: 404 }
    )
  }

  const { model, scores } = result

  const sources = [getArenaSource(), getAASource(), getLiveCodeSwebenchSource()]

  return NextResponse.json({
    model,
    scores,
    sources,
  })
}
