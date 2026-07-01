import { prisma } from '@/lib/db'

// The discover page is the main hub for Stage 1.
// It shows two entry doors (search or guided) and a browsable list of career clusters.
// Cards are intentionally minimal — name, hook question, timeline only.
// The full description lives on the career detail page, not here.

export default async function DiscoverPage() {
  const clusters = await prisma.careerCluster.findMany({
    include: {
      careers: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Page header */}
        <h1 className="text-3xl font-bold mb-2">Explore Careers</h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Every path. Every requirement. Every step after the qualification.
          Nothing hidden, nothing sugarcoated.
        </p>

        {/* Two entry doors — stacked on mobile, side by side on larger screens */}
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          <a href="/discover/search" className="block p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-colors">
            <p className="text-xl mb-1">🔍</p>
            <p className="font-semibold text-sm">I know what I want</p>
            <p className="text-xs text-muted-foreground mt-1">Search by career name</p>
          </a>
          <a href="/discover/guide" className="block p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-colors">
            <p className="text-xl mb-1">🧭</p>
            <p className="font-semibold text-sm">Help me find a career</p>
            <p className="text-xs text-muted-foreground mt-1">Answer a few quick questions</p>
          </a>
        </div>

        {/* Browse by cluster */}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
          Or browse by field
        </p>

        <div className="space-y-6">
          {clusters.map((cluster) => (
            <div key={cluster.id}>
              {/* Cluster label */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {cluster.name}
              </p>

              {/* Career cards — full width, minimal text */}
              <div className="space-y-2">
                {cluster.careers.map((career) => (
                  <a
                    key={career.id}
                    href={`/discover/${career.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-accent transition-colors group"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      {/* Career name — bold, never truncated */}
                      <p className="font-semibold text-sm text-foreground">{career.name}</p>
                      {/* Hook question — short, human, invites curiosity */}
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {career.hookQuestion}
                      </p>
                    </div>
                    {/* Timeline — right aligned, never wraps */}
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{career.timelineRange}</p>
                      <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore →
                      </p>
                    </div>
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