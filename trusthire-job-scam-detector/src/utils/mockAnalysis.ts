// Mock AI Analysis Utility for TrustHire
// Simulates AI-powered job scam detection with random results

export interface AnalysisResult {
  score: number;
  status: "genuine" | "scam" | "caution";
  findings: Finding[];
  advice: string[];
}

export interface Finding {
  type: "danger" | "warning" | "safe";
  message: string;
  icon: string;
}

// Pool of possible scam indicators (danger findings)
const scamIndicators: Finding[] = [
  { type: "danger", message: "Unverified recruiter email domain detected", icon: "mail-warning" },
  { type: "danger", message: "Payment or registration fee requested", icon: "credit-card" },
  { type: "danger", message: "Unrealistic salary mentioned (3x market rate)", icon: "trending-up" },
  { type: "danger", message: "Fake company domain detected", icon: "globe" },
  { type: "danger", message: "Urgency tactics used in communication", icon: "clock" },
  { type: "danger", message: "Personal banking details requested", icon: "lock" },
  { type: "danger", message: "No official company website found", icon: "search-x" },
  { type: "danger", message: "Suspicious WhatsApp-only communication", icon: "message-circle" },
];

// Pool of warning indicators
const warningIndicators: Finding[] = [
  { type: "warning", message: "Company has limited online presence", icon: "alert-triangle" },
  { type: "warning", message: "Job posting contains grammatical errors", icon: "file-text" },
  { type: "warning", message: "Vague job description provided", icon: "help-circle" },
  { type: "warning", message: "Interview process seems unusually fast", icon: "zap" },
  { type: "warning", message: "No LinkedIn profile for recruiter", icon: "user-x" },
  { type: "warning", message: "Generic company email used", icon: "mail" },
];

// Pool of safe indicators
const safeIndicators: Finding[] = [
  { type: "safe", message: "Verified company email domain", icon: "mail-check" },
  { type: "safe", message: "Company registered with government database", icon: "building-2" },
  { type: "safe", message: "Realistic salary range for position", icon: "check-circle" },
  { type: "safe", message: "Professional communication patterns", icon: "message-square" },
  { type: "safe", message: "Official company website verified", icon: "globe" },
  { type: "safe", message: "LinkedIn company profile matches", icon: "linkedin" },
  { type: "safe", message: "No payment requests in communication", icon: "shield-check" },
  { type: "safe", message: "Standard interview process mentioned", icon: "users" },
];

// Safety advice pool
const safetyAdvice = [
  "Do not pay any registration or processing fees",
  "Verify company details on official government registries",
  "Contact company HR through their official website",
  "Check recruiter's LinkedIn profile for authenticity",
  "Never share banking details before official onboarding",
  "Report suspicious offers to cyber crime portal",
  "Cross-verify salary with industry standards",
  "Request official offer letter on company letterhead",
  "Verify company address using Google Maps",
  "Ask for reference from current employees",
];

// Helper function to get random items from array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

// Generate random trust score (0-100)
function generateScore(): number {
  // Weighted random - tends toward middle values for more realistic demos
  const base = Math.random();
  const weighted = Math.pow(base, 0.8); // Slight skew toward higher values
  return Math.round(weighted * 100);
}

// Determine status based on score
function getStatus(score: number): "genuine" | "scam" | "caution" {
  if (score >= 80) return "genuine";
  if (score >= 50) return "caution";
  return "scam";
}

// Generate findings based on score
function generateFindings(score: number): Finding[] {
  const findings: Finding[] = [];
  const status = getStatus(score);

  if (status === "scam") {
    // High risk: More danger findings
    findings.push(...getRandomItems(scamIndicators, 3 + Math.floor(Math.random() * 2)));
    findings.push(...getRandomItems(warningIndicators, 1 + Math.floor(Math.random() * 2)));
    findings.push(...getRandomItems(safeIndicators, Math.floor(Math.random() * 2)));
  } else if (status === "caution") {
    // Medium risk: Mix of findings
    findings.push(...getRandomItems(scamIndicators, 1 + Math.floor(Math.random() * 2)));
    findings.push(...getRandomItems(warningIndicators, 2 + Math.floor(Math.random() * 2)));
    findings.push(...getRandomItems(safeIndicators, 2 + Math.floor(Math.random() * 2)));
  } else {
    // Low risk: More safe findings
    findings.push(...getRandomItems(safeIndicators, 4 + Math.floor(Math.random() * 3)));
    findings.push(...getRandomItems(warningIndicators, Math.floor(Math.random() * 2)));
  }

  // Shuffle findings for variety
  return findings.sort(() => Math.random() - 0.5);
}

// Generate advice based on status
function generateAdvice(status: "genuine" | "scam" | "caution"): string[] {
  const baseAdvice = getRandomItems(safetyAdvice, 4);
  
  if (status === "scam") {
    return [
      "⚠️ HIGH ALERT: Do not proceed with this offer",
      "Report this offer to cyber crime authorities immediately",
      ...baseAdvice.slice(0, 3),
    ];
  } else if (status === "caution") {
    return [
      "Proceed with caution and verify all details",
      ...baseAdvice.slice(0, 4),
    ];
  } else {
    return [
      "This offer appears legitimate, but always stay vigilant",
      ...baseAdvice.slice(0, 3),
    ];
  }
}

// Main analysis function - simulates AI processing
export async function analyzeDocuments(files: File[]): Promise<AnalysisResult> {
  // Simulate processing delay (3-5 seconds)
  const delay = 3000 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const score = generateScore();
  const status = getStatus(score);
  const findings = generateFindings(score);
  const advice = generateAdvice(status);

  return {
    score,
    status,
    findings,
    advice,
  };
}

// Processing steps for loading animation
export const processingSteps = [
  { text: "Extracting text from documents...", duration: 800 },
  { text: "Checking recruiter credentials...", duration: 1000 },
  { text: "Analyzing communication patterns...", duration: 900 },
  { text: "Verifying company information...", duration: 800 },
  { text: "Cross-referencing scam database...", duration: 700 },
  { text: "Generating trust score...", duration: 600 },
];
