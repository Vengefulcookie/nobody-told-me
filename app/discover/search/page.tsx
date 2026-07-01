'use client'

// Search page — Stage 1A.
// User types a career name and sees matching results instantly.
// Cards show name, cluster, hook question, and timeline only.
// No full descriptions — those live on the career detail page.

import { useState, useEffect } from 'react'

interface CareerResult {
  id: string
  name: string
  slug: string
  hookQuestion: string | null
  timelineRange: string
  cluster: { name: string }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CareerResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setSearched(false)
      return
    }

    // Wait 300ms after user stops typing before searching
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/careers?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setSearched(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <a href="/discover" className="text-xs text-muted-foreground hover:text-primary mb-6 block">
          ← Back to explore
        </a>

        <h1 className="text-3xl font-bold mb-1">Search Careers</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Type a career name or field to get started.
        </p>

        {/* Search input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. civil engineering, doctor, software..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm mb-6"
          autoFocus
        />

        {/* Loading */}
        {loading && (
          <p className="text-muted-foreground text-xs">Searching...</p>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-2">
            {results.map((career) => (
              <a
                key={career.id}
                href={`/discover/${career.slug}`}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-accent transition-colors group"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="font-semibold text-sm text-foreground">{career.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{career.cluster.name}</p>
                  {career.hookQuestion && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {career.hookQuestion}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{career.timelineRange}</p>
                  <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore →
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && searched && results.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-sm mb-1">No careers found for "{query}"</p>
            <p className="text-xs text-muted-foreground">
              We are still adding careers.{' '}
              <a href="/discover" className="text-primary hover:underline">Browse all fields</a>.
            </p>
          </div>
        )}

        {/* Initial state */}
        {!loading && !searched && query.length < 2 && (
          <p className="text-center text-muted-foreground text-xs py-10">
            Start typing to search careers
          </p>
        )}

      </div>
    </main>
  )
}