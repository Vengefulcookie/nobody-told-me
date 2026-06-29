'use client'

import { useState, useEffect } from 'react'

interface Source {
  id: string
  sourceName: string
  sourceUrl: string | null
  verifiedDate: string
}

interface Requirement {
  id: string
  description: string
  detail: string | null
  isMandatory: boolean
  type: string
  category: string
  costType: string | null
  costAmountMin: number | null
  costAmountMax: number | null
  costNote: string | null
  sources: Source[]
}

interface PathwayStep {
  id: string
  title: string
  description: string | null
  stepType: string
  durationYears: number | null
  order: number
  requirements: Requirement[]
}

interface Roadmap {
  id: string
  pathwayType: string
  qualification: {
    name: string
    nqfLevel: number
    durationYears: number
  }
  specialization: {
    name: string
    field: {
      name: string
      slug: string
      timelineRange: string
    }
  }
  steps: PathwayStep[]
  requirements: Requirement[]
}

function formatCost(req: Requirement): string | null {
  if (!req.costAmountMin && !req.costAmountMax) return null
  if (req.costAmountMin && req.costAmountMax && req.costAmountMin !== req.costAmountMax) {
    return `R${req.costAmountMin.toLocaleString()} – R${req.costAmountMax.toLocaleString()}`
  }
  if (req.costAmountMin) return `R${req.costAmountMin.toLocaleString()}`
  return null
}

function stepDurationLabel(years: number | null): string {
  if (!years) return ''
  if (years < 1) return `${Math.round(years * 12)} months`
  if (years === 1) return '1 year'
  return `${years} years`
}

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  // ↑ tracks which steps are expanded to show sources
  //   keys are requirement IDs, values are true/false

  useEffect(() => {
    params.then(({ id }) => setId(id))
  }, [params])

  useEffect(() => {
    if (!id) return
    async function fetchRoadmap() {
      try {
        const res = await fetch(`/api/roadmap/${id}`)
        if (!res.ok) { setError('Failed to load roadmap'); return }
        const data = await res.json()
        setRoadmap(data)
      } catch {
        setError('Failed to load roadmap')
      } finally {
        setLoading(false)
      }
    }
    fetchRoadmap()
  }, [id])

  function toggleSource(reqId: string) {
    setExpanded(prev => ({ ...prev, [reqId]: !prev[reqId] }))
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Building your roadmap...</p>
    </div>
  )

  if (error || !roadmap) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">{error ?? 'Roadmap not found'}</p>
        <a href="/discover" className="text-primary hover:underline text-sm">← Back to explore</a>
      </div>
    </div>
  )

  // calculate total mandatory costs across all steps
  const allRequirements = roadmap.steps.flatMap(s => s.requirements).concat(roadmap.requirements)
  const totalMinCost = allRequirements
    .filter(r => r.isMandatory && r.costAmountMin)
    .reduce((sum, r) => sum + (r.costAmountMin ?? 0), 0)
  const totalMaxCost = allRequirements
    .filter(r => r.isMandatory && r.costAmountMax)
    .reduce((sum, r) => sum + (r.costAmountMax ?? 0), 0)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Back link */}
        <a href={`/pathways/${roadmap.specialization.field.slug}`} className="text-sm text-muted-foreground hover:text-primary mb-6 block">
          ← Back to {roadmap.specialization.name} pathways
        </a>

        {/* Header */}
        <h1 className="text-3xl font-bold mb-1">
          {roadmap.specialization.name}
        </h1>
        <p className="text-muted-foreground text-sm mb-1">Via {roadmap.qualification.name}</p>
        <p className="text-muted-foreground text-sm mb-8">⏱ {roadmap.specialization.field.timelineRange}</p>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Study time</p>
            <p className="text-sm font-semibold">{roadmap.qualification.durationYears} years</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">NQF level</p>
            <p className="text-sm font-semibold">{roadmap.qualification.nqfLevel}</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Min. study cost</p>
            <p className="text-sm font-semibold">
              {totalMinCost > 0 ? `R${totalMinCost.toLocaleString()}+` : 'See below'}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Vertical line running through all steps */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {roadmap.steps.map((step, index) => (
              <div key={step.id} className="relative pl-12">

                {/* Step number dot on the timeline */}
                <div className="absolute left-0 w-9 h-9 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                  {index + 1}
                </div>

                {/* Step card */}
                <div className="rounded-xl border border-border overflow-hidden">

                  {/* Step header */}
                  <div className="px-5 py-4 bg-muted/40 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-sm">{step.title}</h2>
                      {step.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
                      )}
                    </div>
                    {step.durationYears && (
                      <span className="text-xs text-muted-foreground shrink-0 bg-background border border-border px-2 py-1 rounded-md">
                        {stepDurationLabel(step.durationYears)}
                      </span>
                    )}
                  </div>

                  {/* Requirements grouped inside the step */}
                  {step.requirements.length > 0 && (
                    <div className="px-5 py-3 space-y-3">
                      {step.requirements.map((req) => {
                        const cost = formatCost(req)
                        const hasSources = req.sources.length > 0
                        const isExpanded = expanded[req.id]

                        return (
                          <div key={req.id} className="flex items-start gap-2.5">

                            {/* Mandatory / optional indicator */}
                            <span className="text-xs shrink-0 mt-0.5">
                              {req.isMandatory ? '🔴' : '🟡'}
                            </span>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-snug">{req.description}</p>

                              {req.detail && (
                                <p className="text-xs text-muted-foreground mt-0.5">{req.detail}</p>
                              )}

                              {/* Cost badge */}
                              {cost && (
                                <div className="mt-1.5 inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs">
                                  <span className="font-medium">💰 {cost}</span>
                                  {req.costNote && (
                                    <span className="text-muted-foreground">— {req.costNote}</span>
                                  )}
                                </div>
                              )}

                              {/* Source toggle */}
                              {hasSources && (
                                <div className="mt-1.5">
                                  <button
                                    onClick={() => toggleSource(req.id)}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    {isExpanded ? '▲ Hide source' : '📎 View source'}
                                  </button>
                                  {isExpanded && (
                                    <div className="mt-1 space-y-0.5">
                                      {req.sources.map((source) => (
                                        <p key={source.id} className="text-xs text-muted-foreground">
                                          {source.sourceUrl ? (
                                            <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                                              {source.sourceName}
                                            </a>
                                          ) : source.sourceName}
                                          {' '}· verified {new Date(source.verifiedDate).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pathway-level requirements at the bottom if any */}
            {roadmap.requirements.length > 0 && (
              <div className="relative pl-12">
                <div className="absolute left-0 w-9 h-9 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs text-muted-foreground">
                  +
                </div>
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="px-5 py-4 bg-muted/40">
                    <h2 className="font-semibold text-sm">General Requirements</h2>
                  </div>
                  <div className="px-5 py-3 space-y-3">
                    {roadmap.requirements.map((req) => {
                      const cost = formatCost(req)
                      const isExpanded = expanded[req.id]
                      return (
                        <div key={req.id} className="flex items-start gap-2.5">
                          <span className="text-xs shrink-0 mt-0.5">{req.isMandatory ? '🔴' : '🟡'}</span>
                          <div className="flex-1">
                            <p className="text-sm">{req.description}</p>
                            {req.detail && <p className="text-xs text-muted-foreground mt-0.5">{req.detail}</p>}
                            {cost && (
                              <div className="mt-1.5 inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs">
                                <span className="font-medium">💰 {cost}</span>
                                {req.costNote && <span className="text-muted-foreground">— {req.costNote}</span>}
                              </div>
                            )}
                            {req.sources.length > 0 && (
                              <div className="mt-1.5">
                                <button onClick={() => toggleSource(req.id)} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                  {isExpanded ? '▲ Hide source' : '📎 View source'}
                                </button>
                                {isExpanded && (
                                  <div className="mt-1">
                                    {req.sources.map((source) => (
                                      <p key={source.id} className="text-xs text-muted-foreground">
                                        {source.sourceUrl ? (
                                          <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">{source.sourceName}</a>
                                        ) : source.sourceName}
                                        {' '}· verified {new Date(source.verifiedDate).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-10 p-4 rounded-lg bg-muted text-xs text-muted-foreground space-y-1">
          <p><span className="mr-1.5">🔴</span>Mandatory — cannot practise professionally without this</p>
          <p><span className="mr-1.5">🟡</span>Optional — for career advancement only</p>
          <p><span className="mr-1.5">💰</span>Cost estimate — verify directly with institutions before applying</p>
          <p className="mt-2 leading-relaxed">Requirements change between application cycles. Always confirm with the relevant institution or professional body before making decisions.</p>
        </div>

      </div>
    </main>
  )
}