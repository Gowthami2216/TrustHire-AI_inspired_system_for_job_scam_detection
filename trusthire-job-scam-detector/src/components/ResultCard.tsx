import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  status: "genuine" | "scam" | "caution";
}

const ResultCard = ({ status }: ResultCardProps) => {
  const config = {
    genuine: {
      icon: CheckCircle,
      title: "Likely Genuine",
      description: "This job offer appears to be legitimate based on our analysis.",
      bgClass: "bg-success/10 border-success/30",
      iconClass: "text-success",
      titleClass: "text-success",
    },
    caution: {
      icon: AlertTriangle,
      title: "Proceed with Caution",
      description: "This offer has some warning signs. Please verify carefully.",
      bgClass: "bg-caution/10 border-caution/30",
      iconClass: "text-caution",
      titleClass: "text-caution",
    },
    scam: {
      icon: XCircle,
      title: "Likely Scam",
      description: "This job offer shows multiple red flags typical of scams.",
      bgClass: "bg-destructive/10 border-destructive/30",
      iconClass: "text-destructive",
      titleClass: "text-destructive",
    },
  };

  const { icon: Icon, title, description, bgClass, iconClass, titleClass } = config[status];

  return (
    <Card className={cn("border-2 transition-all animate-scale-in", bgClass)}>
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
            status === "genuine" && "bg-success/20",
            status === "caution" && "bg-caution/20",
            status === "scam" && "bg-destructive/20"
          )}
        >
          <Icon className={cn("h-7 w-7", iconClass)} />
        </div>
        <div>
          <h3 className={cn("text-xl font-bold", titleClass)}>{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;