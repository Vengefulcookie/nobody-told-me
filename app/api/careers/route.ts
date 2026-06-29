import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  // ↑ pulls the query string from the URL
  // e.g. /api/careers?q=civil → searchParams.get('q') = "civil"

  const q = searchParams.get('q') ?? ''
  // ↑ get the search term, default to empty string if nothing passed

  const careers = await prisma.careerField.findMany({
    where: q.length > 1 ? {
      // ↑ only filter if the user typed more than 1 character
      OR: [
        { name: { contains: q } },
        // ↑ match if the career name contains the search term
        { plainDescription: { contains: q } },
        // ↑ also match against the description
        { cluster: { name: { contains: q } } },
        // ↑ also match the cluster name (so "engineering" finds all engineering careers)
      ],
    } : undefined,
    // ↑ if q is empty, undefined means no filter — return everything
    include: {
      cluster: { select: { name: true } },
      // ↑ include just the cluster name, not the whole cluster object
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(careers)
}