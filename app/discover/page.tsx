import { prisma } from '@/lib/db'

export default async function DiscoverPage() {
  const clusters = await prisma.careerCluster.findMany({
    include: { careers: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
       <h1 className="text-4xl font-bold mb-4">Explore Careers</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every path. Every requirement. Every step after the qualification. 
            Nothing hidden, nothing sugarcoated.
          </p>
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          <a href="/discover/search" className="block p-8 rounded-xl border-2 border-border hover:border-primary transition-colors">
            <h2 className="text-xl font-semibold mb-2">🔍 I know what I am looking for</h2>
            <p className="text-muted-foreground text-sm">Search for a career by name.</p>
          </a>
          <a href="/discover/guide" className="block p-8 rounded-xl border-2 border-border hover:border-primary transition-colors">
            <h2 className="text-xl font-semibold mb-2">🧭 Help me discover careers</h2>
            <p className="text-muted-foreground text-sm">Answer a few questions to find your match.</p>
          </a>
        </div>

        <h2 className="text-xl font-semibold mb-6">Or browse by field</h2>
        <div className="space-y-4">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="rounded-xl border border-border p-6">
              <h3 className="text-lg font-medium mb-1">{cluster.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{cluster.description}</p>
              <div className="space-y-2">
                {cluster.careers.map((career) => (
                  <a key={career.id} href={`/discover/${career.slug}`} className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-accent transition-colors">
                    <div>
                      <p className="font-medium">{career.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{career.plainDescription.split('\n')[0]}</p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0 ml-4">{career.timelineRange}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}