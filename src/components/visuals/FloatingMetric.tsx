import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingMetricProps {
  icon?: LucideIcon;
  iconElement?: React.ReactNode;
  value: string;
  label?: string;
  className?: string;
  animation?: "float" | "float-slow" | "float-delayed" | "float-delayed-2";
  variant?: "default" | "success" | "primary";
}

const FloatingMetric = ({
  icon: Icon,
  iconElement,
  value,
  label,
  className,
  animation = "float",
  variant = "default",
}: FloatingMetricProps) => {
  const variantStyles = {
    default: "bg-card/90 border-border/50",
    success: "bg-card/90 border-primary/20",
    primary: "bg-primary/10 border-primary/30",
  };

  return (
    <div
      className={cn(
        "hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border shadow-lg backdrop-blur-sm",
        variantStyles[variant],
        animation === "float" && "animate-float",
        animation === "float-slow" && "animate-float-slow",
        animation === "float-delayed" && "animate-float-delayed",
        animation === "float-delayed-2" && "animate-float-delayed-2",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4 text-primary" />}
      {iconElement}
      <span className="text-sm font-semibold text-foreground">{value}</span>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
};

export default FloatingMetric;
