import { cn } from "@/lib/utils";

interface MiniTrendChartProps {
  trend?: "up" | "down";
  className?: string;
  animation?: "float" | "float-slow" | "float-delayed" | "float-delayed-2";
}

const MiniTrendChart = ({
  trend = "up",
  className,
  animation = "float-slow",
}: MiniTrendChartProps) => {
  const isUp = trend === "up";

  return (
    <div
      className={cn(
        "hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border shadow-lg backdrop-blur-sm bg-card/90 border-border/50",
        animation === "float" && "animate-float",
        animation === "float-slow" && "animate-float-slow",
        animation === "float-delayed" && "animate-float-delayed",
        animation === "float-delayed-2" && "animate-float-delayed-2",
        className
      )}
    >
      <svg
        width="48"
        height="24"
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {isUp ? (
          <>
            <path
              d="M2 20 L10 16 L18 18 L26 12 L34 8 L42 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            <circle cx="42" cy="4" r="3" fill="currentColor" />
          </>
        ) : (
          <>
            <path
              d="M2 4 L10 8 L18 6 L26 12 L34 16 L42 20"
              stroke="hsl(var(--destructive))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            <circle cx="42" cy="20" r="3" fill="hsl(var(--destructive))" />
          </>
        )}
      </svg>
      <span
        className={cn(
          "text-sm font-bold",
          isUp ? "text-primary" : "text-destructive"
        )}
      >
        {isUp ? "+350%" : "-23%"}
      </span>
    </div>
  );
};

export default MiniTrendChart;
