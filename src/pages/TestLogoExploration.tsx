import { Zap } from "lucide-react";

const VariationCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-6 p-8 rounded-xl border border-border bg-card">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    <div className="flex items-center justify-center min-h-[48px]">{children}</div>
    <div className="flex items-center justify-center min-h-[80px] scale-[2.5] origin-center">{children}</div>
  </div>
);

// Reusable logo icon
const LogoIcon = ({ className = "" }: { className?: string }) => (
  <Zap className={`w-4 h-4 fill-current ${className}`} />
);

const TestLogoExploration = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Superpump — Logo Exploration</h1>
        <p className="text-muted-foreground mb-8">Taille réelle + zoom ×2.5 pour chaque variation</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* 1. Current */}
          <VariationCard label="1. Current (reference)">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">superpump</span>
            </div>
          </VariationCard>

          {/* 2. Rounded full */}
          <VariationCard label="2. Rounded Full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">superpump</span>
            </div>
          </VariationCard>

          {/* 3. Dark monochrome */}
          <VariationCard label="3. Dark Monochrome">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
                <Zap className="w-4 h-4 text-background fill-background" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">superpump</span>
            </div>
          </VariationCard>

          {/* 4. Outlined */}
          <VariationCard label="4. Outlined">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg border-2 border-primary flex items-center justify-center bg-transparent">
                <Zap className="w-4 h-4 text-primary fill-primary" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">superpump</span>
            </div>
          </VariationCard>

          {/* 5. Gradient text */}
          <VariationCard label="5. Gradient Text">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-base font-bold tracking-tight bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">superpump</span>
            </div>
          </VariationCard>

          {/* 6. Bolt only */}
          <VariationCard label="6. Bolt Only">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 fill-current text-transparent bg-gradient-to-br from-primary to-destructive bg-clip-text" style={{ stroke: 'url(#bolt-grad)', fill: 'url(#bolt-grad)' }} />
              <svg width="0" height="0"><defs><linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--destructive))" /></linearGradient></defs></svg>
              <span className="text-base font-bold text-foreground tracking-tight">superpump</span>
            </div>
          </VariationCard>

          {/* 7. Pill shape */}
          <VariationCard label="7. Pill Shape">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-destructive rounded-full px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
              <span className="text-sm font-bold text-white tracking-tight">superpump</span>
            </div>
          </VariationCard>

          {/* 8. Soft shadow */}
          <VariationCard label="8. Soft Shadow">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/80 to-destructive/80 flex items-center justify-center shadow-[0_4px_20px_-2px_hsl(var(--primary)/0.5)]">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">superpump</span>
            </div>
          </VariationCard>

          {/* 9. Minimal lowercase */}
          <VariationCard label="9. Minimal Lowercase">
            <span className="text-lg font-black text-foreground tracking-tighter">superpump</span>
          </VariationCard>

          {/* 10. Stacked */}
          <VariationCard label="10. Stacked">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xs font-bold text-foreground tracking-tight">superpump</span>
            </div>
          </VariationCard>

          {/* 11. Neon glow */}
          <VariationCard label="11. Neon Glow">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center shadow-[0_0_12px_3px_hsl(var(--primary)/0.6),0_0_4px_1px_hsl(var(--primary)/0.4)]">
                <Zap className="w-4 h-4 text-primary fill-primary drop-shadow-[0_0_4px_hsl(var(--primary)/0.8)]" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">superpump</span>
            </div>
          </VariationCard>

          {/* 12. Two-tone */}
          <VariationCard label="12. Two-Tone">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 left-0 w-1/2 bg-primary" />
                <div className="absolute inset-0 left-1/2 w-1/2 bg-destructive" />
                <Zap className="w-4 h-4 text-white fill-white relative z-10" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">superpump</span>
            </div>
          </VariationCard>

        </div>
      </div>
    </div>
  );
};

export default TestLogoExploration;
