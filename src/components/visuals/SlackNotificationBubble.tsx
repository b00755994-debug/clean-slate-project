import slackLogo from "@/assets/slack-logo.png";
import { cn } from "@/lib/utils";

interface SlackNotificationBubbleProps {
  channel: string;
  message: string;
  className?: string;
  animation?: "float" | "float-slow" | "float-delayed" | "float-delayed-2";
}

const SlackNotificationBubble = ({
  channel,
  message,
  className,
  animation = "float",
}: SlackNotificationBubbleProps) => {
  const animationClass = {
    float: "animate-float",
    "float-slow": "animate-float-slow",
    "float-delayed": "animate-float-delayed",
    "float-delayed-2": "animate-float-delayed-2",
  }[animation];

  return (
    <div
      className={cn(
        "bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border-l-4 border-l-[#611f69] px-3 py-2 max-w-[200px]",
        animationClass,
        className
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <img src={slackLogo} alt="Slack" className="h-3 w-3" />
        <span className="text-xs font-semibold text-[#611f69]">{channel}</span>
      </div>
      <p className="text-xs text-gray-700 leading-tight">{message}</p>
    </div>
  );
};

export default SlackNotificationBubble;
