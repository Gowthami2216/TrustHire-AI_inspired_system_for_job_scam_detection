import { Link } from "react-router-dom";
import {
  Shield,
  Upload,
  Search,
  CheckCircle,
  ArrowRight,
  Users,
  FileSearch,
  AlertTriangle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-success/5" />
        
        <div className="container relative px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
              <Shield className="h-4 w-4" />
              AI-Powered Job Scam Detection
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-fade-in">
              Detect Fake Job Offers{" "}
              <span className="text-primary">Before It's Too Late</span>
            </h1>

            {/* Subheadline */}
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-fade-in">
              Upload offer letters, job postings, or chat screenshots. Our AI analyzes
              them for red flags and gives you a trust score to protect your career.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 text-base px-8">
                  <Shield className="h-5 w-5" />
                  Check Job Offer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                  Learn How It Works
                </Button>
              </a>
            </div>

            {/* Trust Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 animate-fade-in">
              {[
                { value: "10,000+", label: "Scams Detected" },
                { value: "50,000+", label: "Jobs Verified" },
                { value: "98%", label: "Accuracy Rate" },
                { value: "24/7", label: "Protection" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-t border-border bg-muted/30 py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              How TrustHire Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to verify any job offer
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: Upload,
                step: "01",
                title: "Upload Documents",
                description:
                  "Upload offer letters (PDF), job postings (images), or chat screenshots from WhatsApp, Email, or Telegram.",
              },
              {
                icon: Search,
                step: "02",
                title: "AI Analysis",
                description:
                  "Our AI examines recruiter credentials, payment requests, salary claims, and communication patterns.",
              },
              {
                icon: CheckCircle,
                step: "03",
                title: "Get Results",
                description:
                  "Receive a trust score (0-100), detailed findings, and smart recommendations to stay safe.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  {/* Step Number */}
                  <div className="absolute right-4 top-4 text-5xl font-bold text-muted/50">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              What We Detect
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI checks for these common scam indicators
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: AlertTriangle,
                title: "Payment Requests",
                description: "Registration fees, processing charges, or training costs",
                color: "text-destructive",
              },
              {
                icon: FileSearch,
                title: "Fake Documents",
                description: "Suspicious offer letters and unofficial communication",
                color: "text-caution",
              },
              {
                icon: Users,
                title: "Recruiter Verification",
                description: "LinkedIn profiles and company email domains",
                color: "text-primary",
              },
              {
                icon: Star,
                title: "Unrealistic Offers",
                description: "Salary claims that exceed market standards",
                color: "text-caution",
              },
              {
                icon: Shield,
                title: "Company Legitimacy",
                description: "Government registration and official website check",
                color: "text-success",
              },
              {
                icon: AlertTriangle,
                title: "Urgency Tactics",
                description: "Pressure to respond immediately or miss opportunity",
                color: "text-destructive",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-primary/5 py-16">
        <div className="container px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            Don't Fall for Job Scams
          </h2>
          <p className="mb-8 text-muted-foreground max-w-xl mx-auto">
            Protect yourself today. It's free, fast, and could save you from fraud.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 text-base px-8">
              <Shield className="h-5 w-5" />
              Check Your Job Offer Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                Trust<span className="text-primary">Hire</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TrustHire. Academic Project Demo. Not a real AI system.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
