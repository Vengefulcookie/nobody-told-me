'use client'

// Pathways page — Stage 2.
// Shows all education routes for a chosen specialisation.
// Each pathway card shows a punchy hook line, key stats, and top requirements.
// The full step-by-step detail lives on the roadmap page — not here.
// Cards are scannable. Teenagers should be able to compare routes in 30 seconds.

import { useState, useEffect } from 'react'

interface Pathway {
  id: string
  pathwayType: string
  isPrimaryPath: boolean
  description: string | null
  qualification: {
    name: string
    qualificationType: string
    nqfLevel: number
    durationYears: number
    description: string | null
  }
  specialization: {
    name: string
    field: { name: string; slug: string }
  }
  steps: Array<{ id: string }>
  requirements: Array<{
    id: string
    description: string
    isMandatory: boolean
    costAmountMin: number | null
    costAmountMax: number | null
  }>
}

// Maps pathway type codes to short readable labels
function pathwayLabel(type: string): string {
  const labels: Record<string, string> = {
    STANDARD_DEGREE: 'University Degree',
    DIPLOMA_ROUTE: 'University of Technology',
    VOCATIONAL_ROUTE: 'TVET College',
    BRIDGING_ROUTE: 'Bridging Route',
    CERTIFICATION_ROUTE: 'Certification Route',
    RPL_ROUTE: 'RPL / Prior Learning',
  }
  return labels[type] ?? type
}

// Generates a short honest hook line per pathway type
// This replaces the long description — explains it simply without being condescending
function hookLine(type: string, nqfLevel: number, durationYears: number): string {
  if (type === 'STANDARD_DEGREE') {
    if (nqfLevel >= 8) {
      return `The highest level. Heavy on theory. Takes the longest. Opens the most doors.`
    }
    return `University route. Theory-based learning. Strong foundation for senior roles.`
  }
  if (type === 'DIPLOMA_ROUTE') {
    return `More hands-on than university. Lower entry requirements. Still leads to professional registration.`
  }
  if (type === 'VOCATIONAL_ROUTE') {
    return `Lowest barrier to entry. Longest total journey. But it is a real door in — and it is open wider than the others.`
  }
  if (type === 'BRIDGING_ROUTE') {
    return `Already have some qualifications? This route may get you there faster.`
  }
  if (type === 'CERTIFICATION_ROUTE') {
    return `Skills-based path. Certifications often matter as much as formal qualifications here.`
  }
  return `${durationYears} years of study. ${nqfLevel} NQF level.`
}

export default function PathwaysPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null)
  const [pathways, setPathways] = useState<Pathway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ slug }) => setSlug(slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    async function fetchPathways() {
      try {
        const res = await fetch(`/api/pathways?specialization=${slug}`)
        if (!res.ok) { setError('Failed to load pathways'); return }
        const data = await res.json()
        if (data.length === 0) {
          setError('No pathways found for this specialisation yet. More careers are being added soon.')
          return
        }
        setPathways(data)
      } catch {
        setError('Failed to load pathways')
      } finally {
        setLoading(false)
      }
    }
    fetchPathways()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Loading pathways...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <a href="/discover" className="text-primary hover:underline text-sm">← Back to explore</a>
      </div>
    </div>
  )

  const careerName = pathways[0]?.specialization.name
  const fieldName = pathways[0]?.specialization.field.name
  const fieldSlug = pathways[0]?.specialization.field.slug

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <a href={`/discover/${fieldSlug}`} className="text-xs text-muted-foreground hover:text-primary mb-6 block">
          ← Back to {fieldName}
        </a>

        <h1 className="text-3xl font-bold mb-1">{careerName}</h1>
        <p className="text-muted-foreground text-sm mb-8">
          {pathways.length} {pathways.length === 1 ? 'route' : 'routes'} available — pick one to see the full roadmap
        </p>

        <div className="space-y-4">
          {pathways.map((pathway) => {
            const hook = hookLine(
              pathway.pathwayType,
              pathway.qualification.nqfLevel,
              pathway.qualification.durationYears
            )
            const mandatoryReqs = pathway.requirements.filter(r => r.isMandatory)

            return (
              <div key={pathway.id} className="rounded-xl border border-border overflow-hidden">

                {/* Card header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      {pathway.isPrimaryPath && (
                        <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full mb-2 inline-block">
                          Primary route
                        </span>
                      )}
                      <p className="font-bold text-base leading-tight">{pathway.qualification.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{pathwayLabel(pathway.pathwayType)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">NQF {pathway.qualification.nqfLevel}</p>
                      <p className="text-xs text-muted-foreground">{pathway.qualification.durationYears} yrs</p>
                    </div>
                  </div>

                  {/* Hook line — replaces the long description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{hook}</p>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                  <div className="px-3 py-2 text-center">
                    <p className="text-xs text-muted-foreground">Study</p>
                    <p className="text-sm font-semibold">{pathway.qualification.durationYears} yrs</p>
                  </div>
                  <div className="px-3 py-2 text-center">
                    <p className="text-xs text-muted-foreground">NQF</p>
                    <p className="text-sm font-semibold">{pathway.qualification.nqfLevel}</p>
                  </div>
                  <div className="px-3 py-2 text-center">
                    <p className="text-xs text-muted-foreground">Stages</p>
                    <p className="text-sm font-semibold">{pathway.steps.length}</p>
                  </div>
                </div>

                {/* Top mandatory requirements preview */}
                {mandatoryReqs.length > 0 && (
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Key requirements</p>
                    <div className="space-y-1.5">
                      {mandatoryReqs.slice(0, 3).map((req) => (
                        <div key={req.id} className="flex items-start gap-2">
                          <span className="text-xs shrink-0 mt-0.5">🔴</span>
                          <p className="text-xs text-foreground leading-relaxed">{req.description}</p>
                        </div>
                      ))}
                      {mandatoryReqs.length > 3 && (
                        <p className="text-xs text-muted-foreground pl-5">
                          + {mandatoryReqs.length - 3} more in the full roadmap
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="px-4 py-3">
                  <a
                    href={`/roadmap/${pathway.id}`}
                    className="block w-full text-center bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
                  >
                    View full roadmap →
                  </a>
                </div>

              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 rounded-xl bg-muted text-xs text-muted-foreground space-y-1">
          <p><span className="mr-1.5">🔴</span>Mandatory — required to practise professionally</p>
          <p><span className="mr-1.5">🟡</span>Optional — for career advancement only</p>
        </div>

      </div>
    </main>
  )
}