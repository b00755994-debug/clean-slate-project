import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SingleReactionProps {
  icon: LucideIcon;
  color: string;
  className?: string;
  animation?: "float" | "float-slow" | "float-delayed" | "float-delayed-2";
}

const SingleReaction = ({
  icon: Icon,
  color,
  className,
  animation = "float",
}: SingleReactionProps) => {
  const animationClass = {
    float: "animate-float",
    "float-slow": "animate-float-slow",
    "float-delayed": "animate-float-delayed",
    "float-delayed-2": "animate-float-delayed-2",
  }[animation];

  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-background",
        animationClass,
        className
      )}
      style={{ backgroundColor: color }}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
  );
};

export default SingleReaction;
