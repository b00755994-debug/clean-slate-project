import { MockLeaderboard } from '@/components/mockups/MockLeaderboard';
import { MockTeamFeed } from '@/components/mockups/MockTeamFeed';
import { MockAnalytics } from '@/components/mockups/MockAnalytics';

export default function Mockups() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card px-6 py-4">
        <h1 className="text-3xl font-bold text-foreground">Mockups — Design Validation</h1>
        <p className="text-muted-foreground text-sm mt-1">Interface previews with sample data</p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
        {/* Section 1: Leaderboard */}
        <section>
          <MockLeaderboard />
        </section>

        <hr className="border-border/30" />

        {/* Section 2: Team Feed */}
        <section>
          <MockTeamFeed />
        </section>

        <hr className="border-border/30" />

        {/* Section 3: Analytics */}
        <section>
          <MockAnalytics />
        </section>
      </main>
    </div>
  );
}
