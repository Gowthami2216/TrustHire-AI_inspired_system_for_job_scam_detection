# TrustHire - ML Model for Job Scam Detection

This folder contains the Machine Learning pipeline for the TrustHire job scam detection system.

## 📁 Files

| File | Description |
|------|-------------|
| `TrustHire_ML_Model.ipynb` | Complete Jupyter notebook with training pipeline |
| `trusthire_analyzer.py` | Standalone Python module for analysis |
| `requirements.txt` | Python dependencies |
| `README.md` | This file |

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ml-model
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('vader_lexicon')"

# Install Tesseract OCR (for image analysis)
# Ubuntu/Debian:
sudo apt-get install tesseract-ocr

# macOS:
brew install tesseract

# Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
```

### 2. Run the Notebook

```bash
jupyter notebook TrustHire_ML_Model.ipynb
```

### 3. Use the Analyzer

```python
from trusthire_analyzer import TrustHireAnalyzer

# Initialize
analyzer = TrustHireAnalyzer()

# Analyze text
result = analyzer.analyze("Pay $500 registration fee for this job!")
print(f"Trust Score: {result['trust_score']}/100")
print(f"Status: {result['status_label']}")
print(f"Red Flags: {result['red_flags']}")
```

## 🧠 ML Pipeline Overview

### 1. Text Preprocessing
- Lowercasing
- URL removal
- Email/money detection
- Tokenization & lemmatization
- Stop word removal

### 2. Feature Extraction

| Feature Category | Examples |
|-----------------|----------|
| Payment Keywords | pay, fee, deposit, registration |
| Urgency Keywords | urgent, immediately, limited time |
| Too-Good-To-Be-True | guaranteed, easy money, no experience |
| Personal Info Requests | bank account, SSN, password |
| Suspicious Contact | WhatsApp, Gmail, Telegram |
| Sentiment Analysis | Compound, positive, negative scores |

### 3. Models Trained
- Logistic Regression
- Random Forest (Best performing)
- Gradient Boosting
- Naive Bayes
- Support Vector Machine

### 4. OCR Integration
- Extract text from screenshots
- Process WhatsApp/Email images
- Analyze job posting images

## 📊 Output Format

```json
{
  "trust_score": 25,
  "status": "scam",
  "status_label": "Likely Scam ⚠",
  "scam_probability": 75,
  "red_flags": [
    "Payment or fee requested",
    "Urgency tactics detected",
    "Personal/banking information requested"
  ],
  "advice": [
    "⚠️ HIGH ALERT: Do not proceed with this offer",
    "Report this to cyber crime authorities",
    "Never pay money to get a job"
  ]
}
```

## 🔗 Web Integration

### Flask API Example

```python
from flask import Flask, request, jsonify
from trusthire_analyzer import analyze_job_offer

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    text = request.json.get('text', '')
    result = analyze_job_offer(text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
```

### API Request

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Your job offer text here"}'
```

## 📈 Model Performance

| Model | Accuracy | ROC-AUC |
|-------|----------|---------|
| Random Forest | 95%+ | 0.98 |
| Gradient Boosting | 93%+ | 0.96 |
| Logistic Regression | 90%+ | 0.94 |

## 📝 Key Red Flags Detected

1. **Payment Requests** - Any mention of fees, deposits, registration costs
2. **Urgency Tactics** - "Act now", "Limited time", "Urgent hiring"
3. **Unrealistic Promises** - "Guaranteed income", "$10,000/week"
4. **Personal Info Requests** - Bank details, SSN, passwords before hiring
5. **Unprofessional Contact** - WhatsApp-only, personal Gmail
6. **Excessive Exclamations** - Multiple "!" marks indicating hype

## 🛡️ Academic Use Notice

This is a frontend demo for academic purposes. The ML model uses:
- Synthetic training data
- Rule-based heuristics
- Statistical classification

For production use, train on real labeled job scam datasets.

## 📚 References

- [NLTK Documentation](https://www.nltk.org/)
- [Scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
