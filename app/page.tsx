export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-sm font-medium text-muted-foreground mb-3 tracking-widest uppercase">
          A Vengeful Cookie Co product
        </p>
        <h1 className="text-5xl font-bold mb-4">
          Nobody Told Me
        </h1>
        <p className="text-xl text-muted-foreground mb-3">
          The qualification is just the beginning.
        </p>
        <p className="text-muted-foreground max-w-lg mx-auto mb-10">
          Discover every career path available to you as a South African student — 
          including every entry requirement, every post-qualification step, and every 
          cost nobody warned you about. From matric to fully qualified, nothing hidden.
        </p>
        <a href="/discover" className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium text-lg hover:bg-primary/80 transition-colors">
          Explore Careers
        </a>
        <p className="text-sm text-muted-foreground mt-6">
          No account needed. Everything is free to explore.
        </p>
      </div>
    </main>
  )
}