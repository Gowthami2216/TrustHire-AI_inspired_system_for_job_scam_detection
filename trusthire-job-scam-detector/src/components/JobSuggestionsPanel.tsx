import { Briefcase, Building2, DollarSign, ExternalLink, Sparkles, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface JobSuggestion {
  title: string;
  company_type: string;
  salary_range: string;
  match_reason: string;
  skills_matched: string[];
  platform: string;
}

interface JobSuggestionsPanelProps {
  suggestions: JobSuggestion[];
  isLoading: boolean;
  error?: string | null;
}

const JobSuggestionsPanel = ({ suggestions, isLoading, error }: JobSuggestionsPanelProps) => {
  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Job Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            Generating Job Suggestions...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 rounded-lg border p-4">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Personalized Job Suggestions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on your uploaded documents, here are roles that match your profile
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((job, index) => (
          <div
            key={index}
            className={cn(
              "rounded-lg border bg-card p-4 space-y-3 transition-all hover:shadow-md animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {job.title}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {job.company_type}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {job.salary_range}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 gap-1" asChild>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(job.title + " jobs " + job.platform)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {job.platform}
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">{job.match_reason}</p>

            {job.skills_matched?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                {job.skills_matched.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default JobSuggestionsPanel;
