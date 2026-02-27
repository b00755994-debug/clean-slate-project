import slackLogo from "@/assets/slack-logo.png";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

const VariationCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-4 p-6 rounded-xl border border-border bg-card">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    <div className="flex items-center justify-center min-h-[40px]">{children}</div>
    <div className="flex items-center justify-center min-h-[56px] scale-[2]">{children}</div>
  </div>
);

const TestSlackBadge = () => {
  const [hoveredMinimal, setHoveredMinimal] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Slack "Select" Badge Variations</h1>
        <p className="text-muted-foreground mb-8">Taille réelle + zoom ×2 pour chaque variation</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 1. Current */}
          <VariationCard label="Current (reference)">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted/50 transition-colors py-1 pl-1.5 pr-2.5 text-xs border-dashed border-muted-foreground/30 gap-1.5">
              <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5 opacity-60" />
              Select
            </Badge>
          </VariationCard>

          {/* 2. Solid Slack purple */}
          <VariationCard label="Solid Slack Purple">
            <Badge className="cursor-pointer py-1 pl-1.5 pr-2.5 text-xs gap-1.5 bg-[#4A154B] text-white border-transparent hover:bg-[#5B2D5C]">
              <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5 brightness-0 invert" />
              Select
            </Badge>
          </VariationCard>

          {/* 3. Ghost button */}
          <VariationCard label="Ghost Button">
            <button className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-all cursor-pointer">
              <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5 opacity-50" />
              Select
            </button>
          </VariationCard>

          {/* 4. Pill icon only */}
          <VariationCard label="Pill Icon Only">
            <div className="cursor-pointer w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted/60 transition-colors">
              <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5 opacity-60" />
            </div>
          </VariationCard>

          {/* 5. Gradient border */}
          <VariationCard label="Gradient Border">
            <div className="p-[1.5px] rounded-full bg-gradient-to-r from-[#4A154B] to-[#E01E5A] cursor-pointer">
              <div className="flex items-center gap-1.5 bg-background rounded-full py-1 pl-1.5 pr-2.5">
                <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold text-foreground">Select</span>
              </div>
            </div>
          </VariationCard>

          {/* 6. Slack colored chip */}
          <VariationCard label="Slack Beige Chip">
            <Badge className="cursor-pointer py-1 pl-1.5 pr-2.5 text-xs gap-1.5 bg-[#F4EDE4] text-[#1D1C1D] border-[#E8DED1] hover:bg-[#EDE3D4]">
              <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5" />
              Select
            </Badge>
          </VariationCard>

          {/* 7. Dotted circle + icon */}
          <VariationCard label="Dotted Circle + Plus">
            <div className="cursor-pointer relative w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-muted-foreground/60 transition-colors">
              <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5 opacity-50" />
              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Plus className="w-2.5 h-2.5" />
              </div>
            </div>
          </VariationCard>

          {/* 8. Underline link style */}
          <VariationCard label="Underline Link">
            <button className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/40 cursor-pointer transition-colors">
              <img src={slackLogo} alt="Slack" className="w-3 h-3" />
              Link Slack
            </button>
          </VariationCard>

          {/* 9. Outlined with arrow */}
          <VariationCard label="Outline + Arrow">
            <Badge variant="outline" className="cursor-pointer py-1 pl-1.5 pr-1.5 text-xs gap-1 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
              <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5 opacity-60" />
              Select
              <ChevronDown className="w-3 h-3 opacity-40" />
            </Badge>
          </VariationCard>

          {/* 10. Floating action */}
          <VariationCard label="Floating Action">
            <button className="w-8 h-8 rounded-full bg-card shadow-lg border border-border flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all cursor-pointer">
              <img src={slackLogo} alt="Slack" className="w-4 h-4" />
            </button>
          </VariationCard>

          {/* 11. Tag style */}
          <VariationCard label="Tag Style">
            <Badge className="cursor-pointer py-0.5 pl-1.5 pr-2 text-[11px] gap-1 rounded-sm bg-accent text-accent-foreground border-transparent hover:bg-accent/80">
              <img src={slackLogo} alt="Slack" className="w-3 h-3" />
              Select
            </Badge>
          </VariationCard>

          {/* 12. Minimal plus → reveal on hover */}
          <VariationCard label="Minimal Plus (hover)">
            <button
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              onMouseEnter={() => setHoveredMinimal(true)}
              onMouseLeave={() => setHoveredMinimal(false)}
            >
              {hoveredMinimal ? (
                <>
                  <img src={slackLogo} alt="Slack" className="w-3.5 h-3.5 animate-pop-in" />
                  <span className="animate-pop-in">Select</span>
                </>
              ) : (
                <Plus className="w-4 h-4 opacity-40" />
              )}
            </button>
          </VariationCard>
        </div>
      </div>
    </div>
  );
};

export default TestSlackBadge;
