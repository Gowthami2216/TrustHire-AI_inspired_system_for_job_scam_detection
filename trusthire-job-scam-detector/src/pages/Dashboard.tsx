// import { useState } from "react";
// import { RefreshCw, ArrowLeft } from "lucide-react";
// import { Link } from "react-router-dom";
// import { toast } from "sonner";
// import Header from "@/components/Header";
// import FileUpload from "@/components/FileUpload";
// import AnalysisLoader from "@/components/AnalysisLoader";
// import TrustScore from "@/components/TrustScore";
// import ResultCard from "@/components/ResultCard";
// import FindingsPanel from "@/components/FindingsPanel";
// import AdviceSection from "@/components/AdviceSection";
// import JobSuggestionsPanel, { type JobSuggestion } from "@/components/JobSuggestionsPanel";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { supabase } from "@/integrations/supabase/client";
// import { analyzeDocuments, type AnalysisResult } from "@/utils/mockAnalysis";

// type DashboardState = "upload" | "analyzing" | "results";

// const Dashboard = () => {
//   const [state, setState] = useState<DashboardState>("upload");
//   const [files, setFiles] = useState<File[]>([]);
//   const [result, setResult] = useState<AnalysisResult | null>(null);
//   const [jobSuggestions, setJobSuggestions] = useState<JobSuggestion[]>([]);
//   const [suggestionsLoading, setSuggestionsLoading] = useState(false);
//   const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

//   const handleFilesSelected = (selectedFiles: File[]) => {
//     setFiles(selectedFiles);
//   };

//   const handleRemoveFile = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const extractTextFromFiles = async (fileList: File[]): Promise<string> => {
//     const texts: string[] = [];
//     for (const file of fileList) {
//       if (file.type === "application/pdf") {
//         texts.push(`[PDF Document: ${file.name}]`);
//       } else if (file.type.startsWith("image/")) {
//         texts.push(`[Image: ${file.name} - Job posting or chat screenshot]`);
//       } else {
//         try {
//           const text = await file.text();
//           texts.push(text);
//         } catch {
//           texts.push(`[File: ${file.name}]`);
//         }
//       }
//     }
//     return texts.join("\n\n");
//   };

//   const fetchJobSuggestions = async (documentText: string, analysisResult: AnalysisResult) => {
//     setSuggestionsLoading(true);
//     setSuggestionsError(null);
//     try {
//       const { data, error } = await supabase.functions.invoke("job-suggestions", {
//         body: { documentText, analysisResult },
//       });

//       if (error) throw error;

//       if (data?.suggestions && Array.isArray(data.suggestions)) {
//         setJobSuggestions(data.suggestions);
//       } else {
//         setJobSuggestions([]);
//       }
//     } catch (err: any) {
//       console.error("Job suggestions error:", err);
//       const msg = err?.message || "Failed to generate job suggestions";
//       setSuggestionsError(msg);
//       toast.error(msg);
//     } finally {
//       setSuggestionsLoading(false);
//     }
//   };

//   const handleAnalyze = async () => {
//     if (files.length === 0) return;

//     setState("analyzing");

//     try {
//       const [analysisResult, documentText] = await Promise.all([
//         analyzeDocuments(files),
//         extractTextFromFiles(files),
//       ]);
//       setResult(analysisResult);
//       setState("results");

//       // Fetch AI job suggestions in background
//       fetchJobSuggestions(documentText, analysisResult);
//     } catch (error) {
//       console.error("Analysis failed:", error);
//       setState("upload");
//     }
//   };

//   const handleReset = () => {
//     setFiles([]);
//     setResult(null);
//     setJobSuggestions([]);
//     setSuggestionsError(null);
//     setState("upload");
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />

//       <main className="container px-4 py-8">
//         {/* Page Header */}
//         <div className="mb-8">
//           <Link
//             to="/"
//             className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Home
//           </Link>
//           <h1 className="text-3xl font-bold text-foreground">Job Offer Analysis</h1>
//           <p className="text-muted-foreground">
//             Upload documents to check if a job offer is genuine or a potential scam
//           </p>
//         </div>

//         {/* Upload State */}
//         {state === "upload" && (
//           <div className="max-w-2xl mx-auto animate-fade-in">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Upload Documents</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <FileUpload
//                   onFilesSelected={handleFilesSelected}
//                   selectedFiles={files}
//                   onRemoveFile={handleRemoveFile}
//                 />

//                 <Button
//                   onClick={handleAnalyze}
//                   disabled={files.length === 0}
//                   className="w-full"
//                   size="lg"
//                 >
//                   Analyze Documents
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Analyzing State */}
//         {state === "analyzing" && (
//           <div className="max-w-2xl mx-auto">
//             <Card>
//               <CardContent className="py-8">
//                 <AnalysisLoader />
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Results State */}
//         {state === "results" && result && (
//           <div className="animate-fade-in">
//             {/* Results Header */}
//             <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h2 className="text-2xl font-bold text-foreground">Analysis Complete</h2>
//                 <p className="text-muted-foreground">
//                   Based on {files.length} document{files.length > 1 ? "s" : ""} analyzed
//                 </p>
//               </div>
//               <Button variant="outline" onClick={handleReset} className="gap-2">
//                 <RefreshCw className="h-4 w-4" />
//                 Analyze Another
//               </Button>
//             </div>

//             {/* Results Grid */}
//             <div className="grid gap-8 lg:grid-cols-3">
//               {/* Left Column - Score & Status */}
//               <div className="space-y-6">
//                 {/* Trust Score Card */}
//                 <Card className="animate-scale-in">
//                   <CardHeader>
//                     <CardTitle className="text-center">Trust Score</CardTitle>
//                   </CardHeader>
//                   <CardContent className="flex justify-center pb-8">
//                     <TrustScore score={result.score} />
//                   </CardContent>
//                 </Card>

//                 {/* Result Status Card */}
//                 <ResultCard status={result.status} />
//               </div>

//               {/* Right Column - Findings & Advice */}
//               <div className="lg:col-span-2 space-y-6">
//                 <FindingsPanel findings={result.findings} />
//                 <AdviceSection advice={result.advice} status={result.status} />
//               </div>
//             </div>

//             {/* Job Suggestions - Full Width Below Results */}
//             <div className="mt-8">
//               <JobSuggestionsPanel
//                 suggestions={jobSuggestions}
//                 isLoading={suggestionsLoading}
//                 error={suggestionsError}
//               />
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
import { useState } from "react";
import { RefreshCw, ArrowLeft, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import AnalysisLoader from "@/components/AnalysisLoader";
import TrustScore from "@/components/TrustScore";
import ResultCard from "@/components/ResultCard";
import FindingsPanel from "@/components/FindingsPanel";
import AdviceSection from "@/components/AdviceSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the shape that your components expect
interface AnalysisResult {
  score: number;
  status: "genuine" | "scam" | "caution";
  findings: Array<{ type: "warning" | "positive"; text: string }>;
  advice: string[];
}

const Dashboard = () => {
  const [state, setState] = useState<"upload" | "analyzing" | "results">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"files" | "text">("files");

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (activeTab === "files") {
      if (files.length === 0) {
        setError("Please upload at least one document");
        return;
      }
      await analyzeFiles();
    } else {
      if (!textInput.trim()) {
        setError("Please enter some text to analyze");
        return;
      }
      await analyzeText();
    }
  };

  const analyzeFiles = async () => {
    setState("analyzing");
    setError(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:5001/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      processResult(data);
    } catch (err: any) {
      console.error("Analysis request failed:", err);
      setError(err.message || "Failed to connect to analysis service");
      setState("upload");
    }
  };

  const analyzeText = async () => {
    setState("analyzing");
    setError(null);

    try {
      const response = await fetch("http://localhost:5001/api/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textInput }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      processResult(data);
    } catch (err: any) {
      console.error("Text analysis request failed:", err);
      setError(err.message || "Failed to connect to analysis service");
      setState("upload");
    }
  };

  const processResult = (data: any) => {
    // Map backend status to the expected union type
    let mappedStatus: "genuine" | "scam" | "caution";
    
    // Normalize the status from backend
    const backendStatus = (data.status || "").toLowerCase();
    
    if (backendStatus.includes("genuine") || backendStatus.includes("legit") || backendStatus.includes("real") || backendStatus.includes("trust") || backendStatus.includes("safe")) {
      mappedStatus = "genuine";
    } else if (backendStatus.includes("scam") || backendStatus.includes("fake") || backendStatus.includes("fraud") || backendStatus.includes("high risk")) {
      mappedStatus = "scam";
    } else if (backendStatus.includes("caution") || backendStatus.includes("warning") || backendStatus.includes("medium")) {
      mappedStatus = "caution";
    } else {
      mappedStatus = "caution"; // Default to caution for unknown states
    }

    const mappedResult: AnalysisResult = {
      score: data.trustScore ?? 50,
      status: mappedStatus,
      findings: [
        ...(data.warnings || []).map((w: string) => ({ type: "warning" as const, text: w })),
        ...(data.positive_indicators || []).map((p: string) => ({ type: "positive" as const, text: p })),
      ],
      advice: data.recommendations ?? [
        "Verify company through official website or government registry",
        "Never pay any money before or during the hiring process",
        "Contact HR only through official email domain",
      ],
    };

    setResult(mappedResult);
    setState("results");
  };

  const handleReset = () => {
    setFiles([]);
    setTextInput("");
    setResult(null);
    setError(null);
    setState("upload");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Job Offer Analysis</h1>
          <p className="text-muted-foreground">
            Upload documents or paste text to check if a job offer is genuine or a potential scam
          </p>
        </div>

        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload State */}
        {state === "upload" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents or Paste Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="files" onValueChange={(value) => setActiveTab(value as "files" | "text")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="files">Upload Files</TabsTrigger>
                    <TabsTrigger value="text">Paste Text</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="files" className="space-y-4 mt-4">
                    <FileUpload
                      onFilesSelected={handleFilesSelected}
                      selectedFiles={files}
                      onRemoveFile={handleRemoveFile}
                    />
                    <div className="text-sm text-muted-foreground">
                      <p>Supported formats:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Offer Letter (PDF)</li>
                        <li>Job Posting (JPG, PNG, JPEG)</li>
                        <li>Chat Screenshots</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="text" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="text-input" className="text-sm font-medium">
                        Paste Job Offer Text
                      </label>
                      <Textarea
                        id="text-input"
                        placeholder="Paste the job offer text, email content, or chat messages here..."
                        value={textInput}
                        onChange={handleTextChange}
                        rows={8}
                        className="resize-y"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter any text from job offers, emails, or chat conversations to analyze for potential scams.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={handleAnalyze}
                  disabled={(activeTab === "files" && files.length === 0) || (activeTab === "text" && !textInput.trim())}
                  className="w-full"
                  size="lg"
                >
                  Analyze {activeTab === "files" ? "Documents" : "Text"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analyzing State */}
        {state === "analyzing" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="py-8">
                <AnalysisLoader />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results State */}
        {state === "results" && result && (
          <div className="animate-fade-in">
            {/* Results Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Analysis Complete</h2>
                <p className="text-muted-foreground">
                  {activeTab === "files" 
                    ? `Based on ${files.length} document${files.length > 1 ? "s" : ""}`
                    : "Based on text analysis"
                  }
                </p>
              </div>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Analyze Another
              </Button>
            </div>

            {/* Results Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Score & Status */}
              <div className="space-y-6">
                {/* Trust Score Card */}
                <Card className="animate-scale-in">
                  <CardHeader>
                    <CardTitle className="text-center">Trust Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-8">
                    <TrustScore score={result.score} />
                  </CardContent>
                </Card>

                {/* Result Status Card */}
                <ResultCard status={result.status} />
              </div>

              {/* Right Column - Findings & Advice */}
              <div className="lg:col-span-2 space-y-6">
                <FindingsPanel findings={result.findings} />
                <AdviceSection advice={result.advice} status={result.status} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;