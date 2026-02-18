import { Lightbulb, ExternalLink, AlertTriangle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdviceSectionProps {
  advice: string[];
  status: "genuine" | "scam" | "caution";
}

const AdviceSection = ({ advice, status }: AdviceSectionProps) => {
  return (
    <Card className="animate-slide-in-right" style={{ animationDelay: "100ms" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Advice List */}
        <ul className="space-y-3">
          {advice.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {status === "scam" && (
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={() => window.open("https://cybercrime.gov.in/", "_blank")}
            >
              <AlertTriangle className="h-4 w-4" />
              Report to Cyber Crime
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() =>
              window.open(
                "https://www.mca.gov.in/mcafoportal/showCheckCompanyName.do",
                "_blank"
              )
            }
          >
            <ExternalLink className="h-4 w-4" />
            Verify Company (MCA)
          </Button>
        </div>

        {/* Safety Tips */}
        <div className="mt-4 rounded-lg bg-muted/50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-foreground">
            💡 Quick Safety Tips
          </h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Never pay money to get a job</li>
            <li>• Legitimate companies don't ask for bank details before joining</li>
            <li>• Verify HR contact through official company website</li>
            <li>• Check LinkedIn for employee reviews</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdviceSection;
