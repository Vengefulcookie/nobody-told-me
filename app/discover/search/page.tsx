'use client'
// ↑ needs to be a client component because it uses useState and useEffect
// for the live search as the user types

import { useState, useEffect } from 'react'

// describes the shape of each career returned by the API
interface CareerResult {
  id: string
  name: string
  slug: string
  plainDescription: string
  timelineRange: string
  cluster: { name: string }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  // ↑ what the user has typed in the search box

  const [results, setResults] = useState<CareerResult[]>([])
  // ↑ the list of matching careers from the API

  const [loading, setLoading] = useState(false)
  // ↑ true while waiting for the API to respond

  const [searched, setSearched] = useState(false)
  // ↑ tracks whether the user has searched yet
  //   so we can show "no results" vs "start typing" correctly

  useEffect(() => {
    // runs every time query changes
    if (query.length < 2) {
      // don't search until at least 2 characters typed
      setResults([])
      setSearched(false)
      return
    }

    // small delay so we don't fire an API call on every single keystroke
    // waits 300ms after the user stops typing before searching
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

    // cleanup: if the user types again before 300ms, cancel the previous timer
    return () => clearTimeout(timer)
  }, [query])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">

        <a href="/discover" className="text-sm text-muted-foreground hover:text-primary mb-8 block">
          ← Back to explore
        </a>

        <h1 className="text-3xl font-bold mb-2">Search Careers</h1>
        <p className="text-muted-foreground mb-8">
          Type a career name or field to get started.
        </p>

        {/* Search input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. civil engineering, doctor, software..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-8"
          autoFocus
        />

        {/* Loading state */}
        {loading && (
          <p className="text-muted-foreground text-sm">Searching...</p>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-3">
            {results.map((career) => (
              <a key={career.id} href={`/discover/${career.slug}`} className="block p-5 rounded-xl border border-border hover:border-primary hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{career.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{career.cluster.name}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {career.plainDescription.split('\n')[0]}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">{career.timelineRange}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No careers found for "{query}"</p>
            <p className="text-sm text-muted-foreground">
              We are still adding careers. Try "engineering" or{' '}
              <a href="/discover" className="text-primary hover:underline">browse all fields</a>.
            </p>
          </div>
        )}

        {/* Initial state — nothing typed yet */}
        {!loading && !searched && query.length < 2 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">Start typing to search careers</p>
          </div>
        )}

      </div>
    </main>
  )
}