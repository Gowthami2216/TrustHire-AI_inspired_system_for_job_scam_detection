

# TrustHire – AI-Inspired Job Scam Detection System

A professional, trust-focused web application for detecting fake job offers (frontend demo for academic purposes).

---

## 🎯 Overview

**TrustHire** helps users verify job offers by analyzing uploaded documents and providing a trust score with detailed explanations. This is a frontend-only demo with simulated AI analysis.


## 📄 Pages & Features

### 1. Landing Page (Home)
- **Header** with TrustHire logo and navigation
- **Hero Section** with tagline: *"Detect Fake Job Offers Before It's Too Late"*
- **Call-to-action button** → "Check Job Offer" (navigates to dashboard)
- **Trust indicators** showing stats like "10,000+ scams detected"
- **How It Works** section with 3-step process cards
- Professional blue/green color scheme conveying trust

### 2. User Dashboard (Analysis Page)

**A. Upload Section**
- Modern drag & drop upload area
- Support for multiple file types:
  - Offer Letters (PDF)
  - Job Postings (JPG, PNG)
  - Chat Screenshots (WhatsApp/Email/Telegram)
- File preview thumbnails after upload
- Upload progress animation
- Clear file format labels and guidance

**B. Analysis Section**
- Loading spinner with animated text: *"Analyzing documents using AI…"*
- Simulated processing steps displayed progressively:
  - "Extracting text from documents..."
  - "Checking recruiter credentials..."
  - "Analyzing communication patterns..."
- 3-5 second simulated delay for realistic demo

**C. Results Section**

**Trust Score Display:**
- Large circular progress meter (0-100)
- Color-coded scoring:
  - 🟢 80-100: Safe (Green)
  - 🟡 50-79: Caution (Yellow/Amber)  
  - 🔴 0-49: High Risk (Red)

**Result Status Banner:**
- "✓ Likely Genuine" (Green, reassuring)
- "⚠ Likely Scam" (Red, warning)

**Detailed Explanation Panel:**
- Bullet-point analysis findings:
  - Recruiter email verification status
  - Payment/fee request detection
  - Salary analysis (realistic vs unrealistic)
  - Company domain verification
  - Communication red flags

**Smart Advice Section:**
- Actionable safety recommendations
- Links to report cyber crime
- Tips for manual verification

---

## 🎨 Design & UX

- **Color Palette:** Blues (trust), greens (safe), reds (warning), clean whites
- **Layout:** Card-based, spacious, modern fintech aesthetic
- **Responsive:** Mobile-first design, works on all devices
- **Animations:** Smooth transitions, hover effects, loading states
- **Typography:** Clean, readable fonts with clear hierarchy
- **Icons:** Lucide icons throughout for consistency

---

## ⚙️ Mock AI Logic

Since this is a frontend demo, the analysis will use:
- Random trust score generation (0-100)
- Weighted random selection of findings
- Randomized scam indicators from a predefined pool
- Realistic delay simulation for "processing"

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── Landing.tsx        # Home page
│   └── Dashboard.tsx      # Analysis dashboard
├── components/
│   ├── Header.tsx         # Navigation header
│   ├── FileUpload.tsx     # Drag & drop uploader
│   ├── AnalysisLoader.tsx # Processing animation
│   ├── TrustScore.tsx     # Circular score meter
│   ├── ResultCard.tsx     # Status display
│   ├── FindingsPanel.tsx  # Detailed explanations
│   └── AdviceSection.tsx  # Safety recommendations
└── utils/
    └── mockAnalysis.ts    # Mock AI logic
```

---

## 🚀 User Flow

1. User lands on home page → Sees professional hero section
2. Clicks "Check Job Offer" → Navigates to dashboard
3. Uploads documents via drag & drop
4. Clicks "Analyze" → Sees loading animation
5. Views results: Trust score, status, findings, and advice
6. Can analyze another document or return home

