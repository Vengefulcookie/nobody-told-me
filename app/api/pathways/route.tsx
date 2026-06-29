import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const specialization = searchParams.get('specialization')
  // ↑ expects /api/pathways?specialization=structural-engineering

  if (!specialization) {
    return NextResponse.json({ error: 'Specialization required' }, { status: 400 })
  }

  const pathways = await prisma.pathway.findMany({
    where: {
      specialization: { slug: specialization }
    },
    include: {
      qualification: true,
      // ↑ the degree/diploma name, NQF level, duration
      specialization: {
        include: { field: true }
        // ↑ which career field this specialization belongs to
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
        // ↑ pathway-level requirements (not tied to a specific step)
        orderBy: { order: 'asc' },
        include: { sources: true }
      }
    },
    orderBy: { isPrimaryPath: 'desc' }
    // ↑ primary path first, alternatives after
  })

  return NextResponse.json(pathways)
}