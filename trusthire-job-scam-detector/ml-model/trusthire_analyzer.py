"""
TrustHire - AI-Powered Job Scam Detection System
Standalone Python module for job scam analysis

Usage:
    from trusthire_analyzer import TrustHireAnalyzer
    analyzer = TrustHireAnalyzer()
    result = analyzer.analyze("Your job offer text here")
"""

import re
import pickle
import numpy as np
from typing import Dict, List, Optional

# NLP imports
try:
    import nltk
    from nltk.tokenize import word_tokenize
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    from nltk.sentiment import SentimentIntensityAnalyzer
    
    # Download required NLTK data
    for package in ['punkt', 'stopwords', 'wordnet', 'vader_lexicon']:
        try:
            nltk.data.find(f'tokenizers/{package}' if package == 'punkt' else f'corpora/{package}' if package in ['stopwords', 'wordnet'] else f'sentiment/{package}')
        except LookupError:
            nltk.download(package, quiet=True)
except ImportError:
    print("Warning: NLTK not installed. Run: pip install nltk")

# OCR imports (optional)
try:
    from PIL import Image
    import pytesseract
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    print("Warning: OCR not available. Install: pip install pillow pytesseract")


class TextPreprocessor:
    """Text preprocessing pipeline for job scam detection."""
    
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        # Keep important negation words
        self.stop_words -= {'no', 'not', 'don', "don't", 'won', "won't"}
    
    def clean_text(self, text: str) -> str:
        """Basic text cleaning."""
        if not isinstance(text, str):
            return ""
        
        text = text.lower()
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        text = re.sub(r'\S+@\S+', ' EMAIL_ADDRESS ', text)
        text = re.sub(r'\$[\d,]+|rs\.?\s*[\d,]+|₹[\d,]+', ' MONEY_AMOUNT ', text, flags=re.IGNORECASE)
        text = re.sub(r'[^a-zA-Z\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize_and_lemmatize(self, text: str) -> str:
        """Tokenize and lemmatize text."""
        tokens = word_tokenize(text)
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens 
                  if token not in self.stop_words and len(token) > 2]
        return ' '.join(tokens)
    
    def preprocess(self, text: str) -> str:
        """Full preprocessing pipeline."""
        cleaned = self.clean_text(text)
        processed = self.tokenize_and_lemmatize(cleaned)
        return processed


class ScamFeatureExtractor:
    """Extract scam-specific features from job postings."""
    
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        
        # Scam indicator keywords
        self.payment_words = {'pay', 'fee', 'deposit', 'transfer', 'money', 'payment', 
                              'registration', 'processing', 'advance', 'cost', 'charge'}
        self.urgency_words = {'urgent', 'immediately', 'now', 'today', 'asap', 'hurry',
                              'limited', 'act', 'quick', 'fast', 'deadline'}
        self.too_good_words = {'guaranteed', 'easy', 'simple', 'no experience', 'dream',
                               'amazing', 'incredible', 'lottery', 'won', 'selected'}
        self.personal_info_words = {'bank', 'account', 'ssn', 'passport', 'id', 'credit card',
                                    'routing', 'password', 'otp', 'verification'}
        self.suspicious_contact = {'whatsapp', 'telegram', 'gmail', 'yahoo', 'hotmail'}
    
    def count_keyword_matches(self, text: str, keywords: set) -> int:
        """Count how many keywords from a set appear in text."""
        text_lower = text.lower()
        return sum(1 for word in keywords if word in text_lower)
    
    def extract_features(self, text: str) -> Dict:
        """Extract all scam-related features from text."""
        text_lower = text.lower()
        
        features = {
            'payment_mentions': self.count_keyword_matches(text, self.payment_words),
            'urgency_mentions': self.count_keyword_matches(text, self.urgency_words),
            'too_good_mentions': self.count_keyword_matches(text, self.too_good_words),
            'personal_info_requests': self.count_keyword_matches(text, self.personal_info_words),
            'suspicious_contact': self.count_keyword_matches(text, self.suspicious_contact),
            'has_money_amount': 1 if re.search(r'\$[\d,]+|rs\.?\s*[\d,]+|₹[\d,]+', text_lower) else 0,
            'exclamation_count': text.count('!'),
            'caps_ratio': sum(1 for c in text if c.isupper()) / max(len(text), 1),
            'word_count': len(text.split()),
            'sentiment_compound': self.sia.polarity_scores(text)['compound'],
            'sentiment_positive': self.sia.polarity_scores(text)['pos'],
            'sentiment_negative': self.sia.polarity_scores(text)['neg'],
            'payment_urgency_combo': 1 if (self.count_keyword_matches(text, self.payment_words) > 0 
                                           and self.count_keyword_matches(text, self.urgency_words) > 0) else 0,
        }
        
        return features
    
    def get_red_flags(self, text: str) -> List[str]:
        """Get list of detected red flags in text."""
        red_flags = []
        text_lower = text.lower()
        
        if self.count_keyword_matches(text, self.payment_words) > 0:
            red_flags.append("Payment or fee requested")
        if self.count_keyword_matches(text, self.urgency_words) > 0:
            red_flags.append("Urgency tactics detected")
        if self.count_keyword_matches(text, self.too_good_words) > 0:
            red_flags.append("Unrealistic promises made")
        if self.count_keyword_matches(text, self.personal_info_words) > 0:
            red_flags.append("Personal/banking information requested")
        if self.count_keyword_matches(text, self.suspicious_contact) > 0:
            red_flags.append("Unprofessional contact methods")
        if re.search(r'\$[\d,]+|rs\.?\s*[\d,]+', text_lower):
            red_flags.append("Specific money amount mentioned")
        if text.count('!') >= 2:
            red_flags.append("Excessive exclamation marks")
            
        return red_flags


class ImageOCR:
    """Extract text from images using Tesseract OCR."""
    
    def __init__(self):
        if not OCR_AVAILABLE:
            raise ImportError("OCR not available. Install: pip install pillow pytesseract")
    
    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """Preprocess image for better OCR results."""
        from PIL import ImageFilter, ImageEnhance
        
        if image.mode != 'L':
            image = image.convert('L')
        
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2)
        image = image.filter(ImageFilter.SHARPEN)
        
        return image
    
    def extract_text(self, image_path: str) -> str:
        """Extract text from an image file."""
        try:
            image = Image.open(image_path)
            processed = self.preprocess_image(image)
            text = pytesseract.image_to_string(processed)
            return text.strip()
        except Exception as e:
            return f"Error extracting text: {str(e)}"
    
    def extract_text_from_bytes(self, image_bytes: bytes) -> str:
        """Extract text from image bytes."""
        from io import BytesIO
        try:
            image = Image.open(BytesIO(image_bytes))
            processed = self.preprocess_image(image)
            text = pytesseract.image_to_string(processed)
            return text.strip()
        except Exception as e:
            return f"Error extracting text: {str(e)}"


class TrustHireAnalyzer:
    """
    Complete Job Scam Detection System.
    
    Uses rule-based analysis with NLP features for scam detection.
    For ML-based analysis, load a trained model using load_model().
    """
    
    def __init__(self, model_path: Optional[str] = None):
        self.preprocessor = TextPreprocessor()
        self.feature_extractor = ScamFeatureExtractor()
        self.ocr = ImageOCR() if OCR_AVAILABLE else None
        
        self.model = None
        self.vectorizer = None
        
        if model_path:
            self.load_model(model_path)
    
    def load_model(self, model_path: str):
        """Load a trained ML model from file."""
        with open(model_path, 'rb') as f:
            package = pickle.load(f)
            self.model = package.get('model')
            self.vectorizer = package.get('vectorizer')
    
    def analyze(self, text: str) -> Dict:
        """
        Analyze a job offer text and return detailed results.
        
        Args:
            text: The job offer text to analyze
            
        Returns:
            dict with trust_score, status, red_flags, feature_analysis, and advice
        """
        # Extract features
        custom_features = self.feature_extractor.extract_features(text)
        red_flags = self.feature_extractor.get_red_flags(text)
        
        # Calculate scam score based on features
        scam_score = 0
        scam_score += custom_features['payment_mentions'] * 15
        scam_score += custom_features['urgency_mentions'] * 10
        scam_score += custom_features['too_good_mentions'] * 12
        scam_score += custom_features['personal_info_requests'] * 20
        scam_score += custom_features['suspicious_contact'] * 8
        scam_score += custom_features['has_money_amount'] * 10
        scam_score += custom_features['payment_urgency_combo'] * 15
        scam_score += min(custom_features['exclamation_count'] * 3, 15)
        
        # Cap at 100
        scam_score = min(scam_score, 100)
        trust_score = max(0, 100 - scam_score)
        
        # Determine status
        if trust_score >= 80:
            status = "genuine"
            status_label = "Likely Genuine ✓"
        elif trust_score >= 50:
            status = "caution"
            status_label = "Proceed with Caution ⚠"
        else:
            status = "scam"
            status_label = "Likely Scam ⚠"
        
        # Generate advice
        advice = self._generate_advice(status, red_flags)
        
        return {
            'trust_score': trust_score,
            'status': status,
            'status_label': status_label,
            'scam_probability': scam_score,
            'red_flags': red_flags,
            'feature_analysis': custom_features,
            'advice': advice
        }
    
    def analyze_image(self, image_path: str) -> Dict:
        """Analyze an image by extracting text first."""
        if not self.ocr:
            return {'error': 'OCR not available', 'trust_score': 0, 'status': 'error'}
        
        extracted_text = self.ocr.extract_text(image_path)
        
        if extracted_text.startswith("Error"):
            return {'error': extracted_text, 'trust_score': 0, 'status': 'error'}
        
        result = self.analyze(extracted_text)
        result['extracted_text'] = extracted_text
        return result
    
    def _generate_advice(self, status: str, red_flags: List[str]) -> List[str]:
        """Generate safety advice based on analysis."""
        advice = []
        
        if status == "scam":
            advice.append("⚠️ HIGH ALERT: Do not proceed with this offer")
            advice.append("Report this to cyber crime authorities")
        elif status == "caution":
            advice.append("Proceed with caution - verify all details")
        else:
            advice.append("This offer appears legitimate, but stay vigilant")
        
        if "Payment or fee requested" in red_flags:
            advice.append("Never pay money to get a job")
        if "Personal/banking information requested" in red_flags:
            advice.append("Don't share bank details before official onboarding")
        if "Unprofessional contact methods" in red_flags:
            advice.append("Verify contact through official company channels")
        
        advice.append("Cross-verify company on official registries")
        advice.append("Check LinkedIn for employee reviews")
        
        return advice


# Convenience function for API integration
def analyze_job_offer(text: str) -> Dict:
    """
    Quick analysis function for API integration.
    
    Args:
        text: Job offer text to analyze
        
    Returns:
        dict with score, status, findings, and advice
    """
    analyzer = TrustHireAnalyzer()
    result = analyzer.analyze(text)
    
    return {
        'score': result['trust_score'],
        'status': result['status'],
        'findings': [
            {
                'type': 'danger' if 'Payment' in flag or 'Personal' in flag else 'warning',
                'message': flag
            }
            for flag in result['red_flags']
        ],
        'advice': result['advice']
    }


if __name__ == "__main__":
    # Test the analyzer
    analyzer = TrustHireAnalyzer()
    
    # Test scam
    scam_text = "Congratulations! Pay $500 registration fee for this amazing job. Contact WhatsApp."
    print("Testing SCAM message:")
    result = analyzer.analyze(scam_text)
    print(f"Trust Score: {result['trust_score']}/100")
    print(f"Status: {result['status_label']}")
    print(f"Red Flags: {result['red_flags']}")
    
    print("\n" + "="*50 + "\n")
    
    # Test genuine
    genuine_text = "We are pleased to offer you the Software Engineer position. Salary $85,000. Report to HR on March 15."
    print("Testing GENUINE message:")
    result = analyzer.analyze(genuine_text)
    print(f"Trust Score: {result['trust_score']}/100")
    print(f"Status: {result['status_label']}")
    print(f"Red Flags: {result['red_flags']}")
