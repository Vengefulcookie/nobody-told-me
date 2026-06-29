'use client'

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
  }>
}

function pathwayTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    STANDARD_DEGREE: 'University Degree',
    DIPLOMA_ROUTE: 'Diploma Route',
    VOCATIONAL_ROUTE: 'TVET College Route',
    BRIDGING_ROUTE: 'Bridging Route',
    CERTIFICATION_ROUTE: 'Certification Route',
    RPL_ROUTE: 'RPL Route',
  }
  return labels[type] ?? type
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
        if (data.length === 0) { setError('No pathways found for this specialisation yet. More careers are being added soon.'); return }
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
      <p className="text-muted-foreground">Loading pathways...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-muted-foreground mb-4">{error}</p>
        <a href="/discover" className="text-primary hover:underline text-sm">← Back to explore</a>
      </div>
    </div>
  )

  const careerName = pathways[0]?.specialization.name
  const fieldName = pathways[0]?.specialization.field.name
  const fieldSlug = pathways[0]?.specialization.field.slug

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <a href={`/discover/${fieldSlug}`} className="text-sm text-muted-foreground hover:text-primary mb-6 block">
          ← Back to {fieldName}
        </a>

        <h1 className="text-3xl font-bold mb-2">{careerName}</h1>
        <p className="text-muted-foreground mb-10">
          {pathways.length} education {pathways.length === 1 ? 'pathway' : 'pathways'} available — choose a route to see the full roadmap
        </p>

        <div className="space-y-4">
          {pathways.map((pathway) => (
            <div key={pathway.id} className="rounded-xl border border-border overflow-hidden hover:border-primary transition-colors">

              {/* Pathway header */}
              <div className="p-6 border-b border-border bg-muted/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {pathway.isPrimaryPath && (
                      <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full mb-2 inline-block">
                        Primary route
                      </span>
                    )}
                    <h2 className="text-xl font-semibold">{pathway.qualification.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{pathwayTypeLabel(pathway.pathwayType)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">NQF {pathway.qualification.nqfLevel}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{pathway.qualification.durationYears} years</p>
                  </div>
                </div>
              </div>

              {/* Summary stats */}
              <div className="p-6 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Study duration</p>
                  <p className="text-sm font-medium">{pathway.qualification.durationYears} years</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">NQF level</p>
                  <p className="text-sm font-medium">{pathway.qualification.nqfLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Stages</p>
                  <p className="text-sm font-medium">{pathway.steps.length} steps to qualify</p>
                </div>
              </div>

              {/* Description if available */}
              {pathway.description && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground">{pathway.description}</p>
                </div>
              )}

              {/* Key entry requirements preview */}
              {pathway.requirements.filter(r => r.isMandatory).length > 0 && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Key requirements</p>
                  <div className="space-y-1">
                    {pathway.requirements.filter(r => r.isMandatory).slice(0, 3).map((req) => (
                      <p key={req.id} className="text-sm flex items-start gap-2">
                        <span className="text-xs mt-0.5 shrink-0">🔴</span>
                        {req.description}
                      </p>
                    ))}
                    {pathway.requirements.filter(r => r.isMandatory).length > 3 && (
                      <p className="text-xs text-muted-foreground">+ {pathway.requirements.filter(r => r.isMandatory).length - 3} more requirements in the full roadmap</p>
                    )}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="px-6 pb-6">
                <a href={`/roadmap/${pathway.id}`} className="inline-block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors">
                  View full roadmap →
                </a>
              </div>

            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-lg bg-muted text-sm text-muted-foreground">
          <p><span className="mr-2">🔴</span>Mandatory — required to practise professionally</p>
          <p className="mt-1"><span className="mr-2">🟡</span>Optional — for career advancement only</p>
        </div>

      </div>
    </main>
  )
}