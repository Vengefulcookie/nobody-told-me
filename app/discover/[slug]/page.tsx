'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface CareerDetail {
  name: string
  plainDescription: string
  hookQuestion: string | null
  timelineRange: string
  cluster: { name: string }
  specializations: Array<{
    id: string
    name: string
    description: string | null
  }>
}

export default function CareerDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [career, setCareer] = useState<CareerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCareer() {
      try {
        const res = await fetch(`/api/careers/${slug}`)
        if (!res.ok) {
          if (res.status === 404) setError('Career not found')
          else setError('Failed to load career')
          return
        }
        const data = await res.json()
        setCareer(data)
      } catch {
        setError('Failed to load career')
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchCareer()
  }, [slug])

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8">{error}</div>
  if (!career) return <div className="p-8">Career not found</div>

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <a href="/" className="text-sm text-muted-foreground hover:text-primary mb-6 block">
          ← Back to all careers
        </a>

        <h1 className="text-3xl font-bold mb-2">{career.name}</h1>
        <p className="text-muted-foreground mb-2">{career.cluster.name}</p>
        <p className="text-sm text-muted-foreground mb-8">Timeline: {career.timelineRange}</p>

        <div className="mb-8 whitespace-pre-line text-foreground leading-relaxed">
          {career.plainDescription}
        </div>

        {career.hookQuestion && (
          <div className="p-4 rounded-lg bg-accent mb-8">
            <p className="font-medium">🤔 {career.hookQuestion}</p>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">Specialisations</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {career.specializations.map((spec: any) => (
            <a key={spec.id} href={`/pathways/${spec.slug}`} className="block p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors">
              <h3 className="font-medium">{spec.name}</h3>
                {spec.description && (
                  <p className="text-sm text-muted-foreground mt-2">{spec.description}</p>
                )}
              <p className="text-xs text-primary mt-3">View pathways →</p>
                </a>
              ))}
        </div>
      </div>
    </main>
  )
}