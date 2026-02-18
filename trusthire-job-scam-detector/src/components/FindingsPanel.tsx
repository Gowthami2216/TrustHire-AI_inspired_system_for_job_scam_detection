import {
  Mail,
  CreditCard,
  TrendingUp,
  Globe,
  Clock,
  Lock,
  SearchX,
  MessageCircle,
  AlertTriangle,
  FileText,
  HelpCircle,
  Zap,
  UserX,
  MailCheck,
  Building2,
  CheckCircle,
  MessageSquare,
  Linkedin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Finding } from "@/utils/mockAnalysis";

interface FindingsPanelProps {
  findings: Finding[];
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "mail-warning": Mail,
  "credit-card": CreditCard,
  "trending-up": TrendingUp,
  globe: Globe,
  clock: Clock,
  lock: Lock,
  "search-x": SearchX,
  "message-circle": MessageCircle,
  "alert-triangle": AlertTriangle,
  "file-text": FileText,
  "help-circle": HelpCircle,
  zap: Zap,
  "user-x": UserX,
  mail: Mail,
  "mail-check": MailCheck,
  "building-2": Building2,
  "check-circle": CheckCircle,
  "message-square": MessageSquare,
  linkedin: Linkedin,
  "shield-check": ShieldCheck,
  users: Users,
};

const FindingsPanel = ({ findings }: FindingsPanelProps) => {
  const getTypeStyles = (type: Finding["type"]) => {
    switch (type) {
      case "danger":
        return {
          bg: "bg-destructive/10",
          border: "border-destructive/30",
          icon: "text-destructive",
          text: "text-destructive",
        };
      case "warning":
        return {
          bg: "bg-caution/10",
          border: "border-caution/30",
          icon: "text-caution",
          text: "text-caution",
        };
      case "safe":
        return {
          bg: "bg-success/10",
          border: "border-success/30",
          icon: "text-success",
          text: "text-success",
        };
    }
  };

  const dangerFindings = findings.filter((f) => f.type === "danger");
  const warningFindings = findings.filter((f) => f.type === "warning");
  const safeFindings = findings.filter((f) => f.type === "safe");

  const renderFinding = (finding: Finding, index: number) => {
    const styles = getTypeStyles(finding.type);
    const Icon = iconMap[finding.icon] || AlertTriangle;

    return (
      <div
        key={index}
        className={cn(
          "flex items-start gap-3 rounded-lg border p-3 transition-all animate-fade-in",
          styles.bg,
          styles.border
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            finding.type === "danger" && "bg-destructive/20",
            finding.type === "warning" && "bg-caution/20",
            finding.type === "safe" && "bg-success/20"
          )}
        >
          <Icon className={cn("h-4 w-4", styles.icon)} />
        </div>
        <p className={cn("text-sm font-medium pt-1", styles.text)}>
          {finding.message}
        </p>
      </div>
    );
  };

  return (
    <Card className="animate-slide-in-right">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Detailed Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Danger Findings */}
        {dangerFindings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Red Flags Detected ({dangerFindings.length})
            </h4>
            <div className="space-y-2">
              {dangerFindings.map((finding, idx) => renderFinding(finding, idx))}
            </div>
          </div>
        )}

        {/* Warning Findings */}
        {warningFindings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-caution flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Warnings ({warningFindings.length})
            </h4>
            <div className="space-y-2">
              {warningFindings.map((finding, idx) =>
                renderFinding(finding, idx + dangerFindings.length)
              )}
            </div>
          </div>
        )}

        {/* Safe Findings */}
        {safeFindings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-success flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Positive Indicators ({safeFindings.length})
            </h4>
            <div className="space-y-2">
              {safeFindings.map((finding, idx) =>
                renderFinding(
                  finding,
                  idx + dangerFindings.length + warningFindings.length
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FindingsPanel;
