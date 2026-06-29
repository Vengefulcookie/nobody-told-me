import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const pathway = await prisma.pathway.findUnique({
    where: { id },
    include: {
      qualification: true,
      specialization: {
        include: { field: true }
      },
      steps: {
        orderBy: { order: 'asc' },
        include: {
          requirements: {
            orderBy: { order: 'asc' },
            include: { sources: true }
          }
        }
      },
      requirements: {
        orderBy: { order: 'asc' },
        include: { sources: true }
      }
    }
  })

  if (!pathway) {
    return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 })
  }

  return NextResponse.json(pathway)
}