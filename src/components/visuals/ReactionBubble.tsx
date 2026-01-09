import { cn } from "@/lib/utils";
import { ThumbsUp, Heart, PartyPopper } from "lucide-react";

interface ReactionBubbleProps {
  className?: string;
  animation?: "float" | "float-slow" | "float-delayed" | "float-delayed-2";
}

const ReactionBubble = ({
  className,
  animation = "float-delayed",
}: ReactionBubbleProps) => {
  return (
    <div
      className={cn(
        "hidden md:flex items-center -space-x-1",
        animation === "float" && "animate-float",
        animation === "float-slow" && "animate-float-slow",
        animation === "float-delayed" && "animate-float-delayed",
        animation === "float-delayed-2" && "animate-float-delayed-2",
        className
      )}
    >
      <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center border-2 border-background shadow-md">
        <ThumbsUp className="h-4 w-4 text-white" />
      </div>
      <div className="w-8 h-8 rounded-full bg-[#DF704D] flex items-center justify-center border-2 border-background shadow-md">
        <Heart className="h-4 w-4 text-white" />
      </div>
      <div className="w-8 h-8 rounded-full bg-[#6DAE4F] flex items-center justify-center border-2 border-background shadow-md">
        <PartyPopper className="h-4 w-4 text-white" />
      </div>
    </div>
  );
};

export default ReactionBubble;
