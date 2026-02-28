import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import type { RevalidateRequest, RevalidateResponse, ErrorResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest
): Promise<NextResponse<RevalidateResponse | ErrorResponse>> {
  try {
    const body = (await request.json()) as RevalidateRequest

    const secret = body.secret
    const source = body.source

    const expectedSecret = process.env.REVALIDATE_SECRET

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid secret token',
          statusCode: 401,
        },
        { status: 401 }
      )
    }

    if (!source || !['hf', 'aa', 'all'].includes(source)) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Invalid source. Must be one of: hf, aa, all',
          statusCode: 400,
        },
        { status: 400 }
      )
    }

    const revalidated: string[] = []

    if (source === 'all' || source === 'hf') {
      revalidatePath('/api/v1/models')
      revalidatePath('/api/v1/benchmarks')
      revalidatePath('/api/v1/compare')
      revalidated.push('hf-leaderboard')
    }

    if (source === 'all' || source === 'aa') {
      revalidatePath('/api/v1/models')
      revalidatePath('/api/v1/benchmarks')
      revalidatePath('/api/v1/compare')
      revalidated.push('artificial-analysis')
    }

    revalidatePath('/api/v1/health')
    revalidated.push('health')

    return NextResponse.json({
      success: true,
      revalidated,
      message: `Revalidated ${revalidated.join(', ')}`,
    })
  } catch {
    return NextResponse.json(
      {
        error: 'Bad Request',
        message: 'Invalid request body',
        statusCode: 400,
      },
      { status: 400 }
    )
  }
}
