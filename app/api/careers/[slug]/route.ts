import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
  // ↑ In Next.js 15+, params is a Promise, not a plain object.
  //   We tell TypeScript this by wrapping the type in Promise<...>
) {
  const { slug } = await params
  // ↑ We must await params before we can read slug from it.
  //   Previously we tried params.slug directly — that returned undefined
  //   because the Promise hadn't resolved yet, which caused the 500 error.

  const career = await prisma.careerField.findUnique({
    where: { slug },
    include: {
      cluster: true,
      specializations: {
        orderBy: { name: 'asc' }
      },
    },
  })

  if (!career) {
    return NextResponse.json(
      { error: 'Career not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(career)
}