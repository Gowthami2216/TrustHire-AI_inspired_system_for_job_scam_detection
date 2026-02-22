# # app.py
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import pickle
# import numpy as np
# from werkzeug.utils import secure_filename
# import fitz  # PyMuPDF
# import traceback
# import joblib
# from sklearn.feature_extraction.text import TfidfVectorizer

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
# app = Flask(__name__)

# CORS(app, resources={
#     r"/api/*": {
#         "origins": ["http://localhost:8080", "http://127.0.0.1:8080", "*"],
#         "methods": ["GET", "POST", "OPTIONS"],
#         "allow_headers": ["Content-Type"]
#     }
# })

# UPLOAD_FOLDER = "uploads"
# ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 12 * 1024 * 1024

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs("models", exist_ok=True)

# # ============ LOAD YOUR TRAINED MODEL ============
# model = None
# vectorizer = None

# try:
#     # Load your trained model
#     model_path = os.path.join("models", "model.pkl")
#     if os.path.exists(model_path):
#         with open(model_path, "rb") as f:
#             model = pickle.load(f)
#         print(f"✅ YOUR TRAINED MODEL LOADED: {type(model).__name__}")
        
#         # Check if model is fitted
#         if hasattr(model, 'classes_'):
#             print(f"   ✅ Model is FITTED with classes: {model.classes_}")
#             print(f"   📊 Number of features: {model.n_features_in_ if hasattr(model, 'n_features_in_') else 'N/A'}")
            
#             # Try to load vectorizer if it exists (for text models)
#             vec_path = os.path.join("models", "vectorizer.pkl")
#             if os.path.exists(vec_path):
#                 with open(vec_path, "rb") as f:
#                     vectorizer = pickle.load(f)
#                 print(f"   ✅ Vectorizer loaded: {type(vectorizer).__name__}")
#             else:
#                 print("   ⚠️ No vectorizer found - will use feature extraction")
#         else:
#             print("   ❌ Model is NOT fitted! Will retrain...")
#             # Retrain a simple model
#             from sklearn.naive_bayes import MultinomialNB
#             from sklearn.feature_extraction.text import CountVectorizer
            
#             # Training data
#             X_train = [
#                 "URGENT! Pay registration fee of ₹2000 to get job",
#                 "Work from home, earn ₹50000/month, send money for processing",
#                 "Congratulations! You won lottery, transfer fee to claim",
#                 "Job offer: Software Engineer at Google, interview on campus",
#                 "Thank you for applying, please find attached offer letter",
#                 "Interview scheduled for next week at our Bangalore office",
#                 "Send ₹5000 as security deposit to confirm your selection",
#                 "WhatsApp only: +91 98765 43210 for immediate joining",
#                 "We are pleased to offer you the position of Developer",
#                 "URGENT: Pay now or lose this opportunity forever"
#             ]
#             y_train = [1, 1, 1, 0, 0, 0, 1, 1, 0, 1]  # 1 = scam, 0 = genuine
            
#             vectorizer = CountVectorizer()
#             X_train_vec = vectorizer.fit_transform(X_train)
            
#             model = MultinomialNB()
#             model.fit(X_train_vec, y_train)
#             print("   ✅ New model trained successfully!")
            
#             # Save the new model
#             with open("models/retrained_model.pkl", "wb") as f:
#                 pickle.dump(model, f)
#             with open("models/retrained_vectorizer.pkl", "wb") as f:
#                 pickle.dump(vectorizer, f)
#             print("   💾 New model saved as 'retrained_model.pkl'")
#     else:
#         print("❌ No model.pkl found - using fallback detection")
        
# except Exception as e:
#     print(f"❌ Error loading model: {e}")
#     traceback.print_exc()
#     model = None
#     vectorizer = None

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def extract_text(filepath):
#     text = ""
#     try:
#         if filepath.lower().endswith('.pdf'):
#             doc = fitz.open(filepath)
#             for page in doc:
#                 text += page.get_text() + "\n"
#             doc.close()
#     except Exception as e:
#         print(f"Text extraction error: {e}")
#     return text.strip()[:15000]

# # ============ ACTUAL MODEL PREDICTION FUNCTION ============
# def predict_with_trained_model(text):
#     """
#     THIS FUNCTION ACTUALLY USES YOUR TRAINED MODEL
#     """
#     global model, vectorizer
    
#     # If no model, use fallback
#     if model is None:
#         print("⚠️ No model available - using fallback")
#         return get_fallback_prediction(text)
    
#     try:
#         # Prepare features based on what your model expects
#         if vectorizer is not None:
#             # If you have a vectorizer, use it (for text models)
#             features = vectorizer.transform([text])
#             print(f"✅ Using vectorizer: features shape {features.shape}")
#         else:
#             # If your model expects numerical features
#             # YOU NEED TO CUSTOMIZE THIS BASED ON HOW YOU TRAINED YOUR MODEL
#             features = extract_numerical_features(text)
#             print(f"✅ Using numerical features: shape {features.shape}")
        
#         # Make prediction with YOUR trained model
#         if hasattr(model, "predict_proba"):
#             probabilities = model.predict_proba(features)[0]
#             prediction = model.predict(features)[0]
            
#             print(f"📊 Model probabilities: {probabilities}")
#             print(f"🎯 Model prediction: {prediction}")
            
#             # Map to trust score (assuming class 1 = scam)
#             if len(probabilities) == 2:
#                 prob_scam = probabilities[1]  # Class 1 is scam
#                 prob_genuine = probabilities[0]
#             else:
#                 prob_scam = probabilities[0]
            
#             trust_score = int(round((1 - prob_scam) * 100))
            
#         else:
#             prediction = model.predict(features)[0]
#             print(f"🎯 Model prediction: {prediction}")
            
#             # Convert prediction to trust score
#             if prediction in [1, 'scam', 'high_risk']:
#                 trust_score = 20
#                 prob_scam = 0.8
#             elif prediction in [0, 'genuine', 'safe']:
#                 trust_score = 80
#                 prob_scam = 0.2
#             else:
#                 trust_score = 50
#                 prob_scam = 0.5
        
#         # Ensure trust score is within bounds
#         trust_score = max(0, min(100, trust_score))
        
#         # Generate warnings based on model output
#         warnings = []
#         if trust_score < 40:
#             warnings.append(f"🚨 YOUR MODEL PREDICTS: HIGH RISK (confidence: {prob_scam:.0%})")
#         elif trust_score < 70:
#             warnings.append(f"⚠️ YOUR MODEL PREDICTS: MEDIUM RISK (confidence: {prob_scam:.0%})")
#         else:
#             warnings.append(f"✅ YOUR MODEL PREDICTS: LOW RISK (confidence: {1-prob_scam:.0%})")
        
#         # Add specific warnings based on features
#         if "pay" in text.lower() or "fee" in text.lower():
#             warnings.append("💰 Payment keywords detected")
#         if "whatsapp" in text.lower():
#             warnings.append("📱 WhatsApp mention detected")
        
#         positive_indicators = []
#         if trust_score >= 70:
#             positive_indicators.append(f"✅ Model confidence: High trust score")
#         if "company" in text.lower() or "website" in text.lower():
#             positive_indicators.append("✓ Company information present")
        
#         return {
#             "trust_score": trust_score,
#             "prob_scam": prob_scam,
#             "status": map_status_to_frontend(trust_score),
#             "warnings": warnings[:3],  # Max 3 warnings
#             "positive_indicators": positive_indicators[:2],
#             "prediction": str(prediction),
#             "model_used": "YOUR TRAINED MODEL",
#             "success": True
#         }
        
#     except Exception as e:
#         print(f"❌ Model prediction error: {e}")
#         traceback.print_exc()
#         return get_fallback_prediction(text)

# def extract_numerical_features(text):
#     """
#     Extract numerical features if your model expects them
#     YOU MUST CUSTOMIZE THIS BASED ON YOUR TRAINING DATA
#     """
#     text_lower = text.lower()
    
#     # Example features - REPLACE WITH YOUR ACTUAL FEATURES
#     features = [
#         len(text),  # text length
#         len(text.split()),  # word count
#         text_lower.count("urgent"),
#         text_lower.count("pay"),
#         text_lower.count("fee"),
#         text_lower.count("bank"),
#         text_lower.count("money"),
#         1 if "whatsapp" in text_lower else 0,
#         text_lower.count("register"),
#         text_lower.count("transfer"),
#         text_lower.count("job"),
#         text_lower.count("offer"),
#         text_lower.count("salary"),
#         text_lower.count("interview"),
#         1 if "@" in text else 0,  # has email
#         1 if "http" in text_lower else 0,  # has URL
#     ]
    
#     return np.array(features).reshape(1, -1)

# def get_fallback_prediction(text):
#     """Fallback when model fails"""
#     text_lower = text.lower()
#     scam_keywords = ["urgent", "pay", "fee", "bank", "whatsapp", "money", "transfer", "register"]
#     keyword_count = sum(1 for kw in scam_keywords if kw in text_lower)
    
#     if keyword_count >= 3:
#         trust_score = 30
#         warnings = ["⚠️ FALLBACK: Multiple scam keywords detected"]
#     elif keyword_count >= 1:
#         trust_score = 60
#         warnings = ["⚠️ FALLBACK: Some suspicious keywords detected"]
#     else:
#         trust_score = 85
#         warnings = ["✅ FALLBACK: No obvious red flags"]
    
#     return {
#         "trust_score": trust_score,
#         "prob_scam": (100 - trust_score) / 100,
#         "status": map_status_to_frontend(trust_score),
#         "warnings": warnings,
#         "positive_indicators": ["Using fallback detection - model unavailable"],
#         "model_used": "FALLBACK (keyword counting)",
#         "success": True,
#         "fallback": True
#     }

# def map_status_to_frontend(trust_score):
#     if trust_score >= 70:
#         return "genuine"
#     elif trust_score >= 40:
#         return "caution"
#     else:
#         return "scam"

# @app.route('/health')
# def health():
#     return jsonify({
#         "status": "ok",
#         "model_loaded": model is not None,
#         "model_fitted": hasattr(model, 'classes_') if model else False,
#         "using_real_model": hasattr(model, 'classes_') if model else False,
#         "detection_mode": "REAL TRAINED MODEL" if (model and hasattr(model, 'classes_')) else "FALLBACK"
#     })

# @app.route('/api/analyze', methods=['POST'])
# def analyze():
#     if 'files' not in request.files:
#         return jsonify({"error": "No files part"}), 400

#     files = request.files.getlist('files')
    
#     if not files or files[0].filename == '':
#         return jsonify({"error": "No files selected"}), 400

#     saved_paths = []
#     extracted_texts = []

#     try:
#         for file in files:
#             if file and allowed_file(file.filename):
#                 filename = secure_filename(file.filename)
#                 filepath = os.path.join(UPLOAD_FOLDER, filename)
#                 file.save(filepath)
#                 saved_paths.append(filepath)
                
#                 text = extract_text(filepath)
#                 if text:
#                     extracted_texts.append(text)

#         if not saved_paths:
#             return jsonify({"error": "No valid files"}), 400

#         combined_text = "\n\n".join(extracted_texts) if extracted_texts else "Document uploaded"
        
#         # USE YOUR TRAINED MODEL HERE
#         if model and hasattr(model, 'classes_'):
#             prediction = predict_with_trained_model(combined_text)
#             print("✅ Using REAL TRAINED MODEL for prediction")
#         else:
#             prediction = get_fallback_prediction(combined_text)
#             print("⚠️ Using FALLBACK detection")

#         result = {
#             "trustScore": prediction['trust_score'],
#             "status": prediction['status'],
#             "probability_scam_percent": round(prediction['prob_scam'] * 100, 1),
#             "warnings": prediction['warnings'],
#             "positive_indicators": prediction['positive_indicators'],
#             "recommendations": [
#                 "🔍 Verify company through official website",
#                 "💰 Never pay any money during hiring",
#                 "📧 Contact HR through official email",
#                 "🌐 Check for similar scam reports online"
#             ],
#             "extracted_text_length": len(combined_text),
#             "files_processed": len(saved_paths),
#             "model_used": prediction.get('model_used', 'unknown')
#         }

#         return jsonify(result), 200

#     except Exception as e:
#         print(f"❌ Error: {e}")
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500

#     finally:
#         for path in saved_paths:
#             try:
#                 if os.path.exists(path):
#                     os.remove(path)
#             except:
#                 pass

# @app.route('/api/analyze-text', methods=['POST'])
# def analyze_text():
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data = request.get_json()
#     text = data.get('text', '').strip()

#     if not text:
#         return jsonify({"error": "Missing text"}), 400

#     # USE YOUR TRAINED MODEL HERE
#     if model and hasattr(model, 'classes_'):
#         prediction = predict_with_trained_model(text)
#         print("✅ Using REAL TRAINED MODEL for text analysis")
#     else:
#         prediction = get_fallback_prediction(text)
#         print("⚠️ Using FALLBACK detection for text")

#     result = {
#         "trustScore": prediction['trust_score'],
#         "status": prediction['status'],
#         "probability_scam_percent": round(prediction['prob_scam'] * 100, 1),
#         "warnings": prediction['warnings'],
#         "positive_indicators": prediction['positive_indicators'],
#         "recommendations": [
#             "🔍 Verify company through official website",
#             "💰 Never pay any money during hiring",
#             "📧 Contact HR through official email",
#             "🌐 Check for similar scam reports online"
#         ],
#         "model_used": prediction.get('model_used', 'unknown')
#     }
    
#     return jsonify(result), 200

# @app.route('/debug/model-status', methods=['GET'])
# def model_status():
#     """Check if real model is being used"""
#     return jsonify({
#         "using_real_model": model is not None and hasattr(model, 'classes_'),
#         "model_type": str(type(model)) if model else None,
#         "is_fitted": hasattr(model, 'classes_') if model else False,
#         "vectorizer_loaded": vectorizer is not None,
#         "message": "✅ Using REAL trained model" if (model and hasattr(model, 'classes_')) else "⚠️ Using FALLBACK detection"
#     })

# if __name__ == '__main__':
#     print("\n" + "="*80)
#     print("🚀 TRUSTHIRE BACKEND - MODEL STATUS")
#     print("="*80)
    
#     if model and hasattr(model, 'classes_'):
#         print("✅✅✅ USING YOUR REAL TRAINED MODEL ✅✅✅")
#         print(f"   Model type: {type(model).__name__}")
#         print(f"   Classes: {model.classes_}")
#         if hasattr(model, 'n_features_in_'):
#             print(f"   Features: {model.n_features_in_}")
#     elif model:
#         print("⚠️ Model loaded but NOT FITTED - using fallback")
#     else:
#         print("⚠️ No model loaded - using fallback detection")
    
#     print("\n📡 Endpoints:")
#     print("   GET  /debug/model-status  - Check if real model is used")
#     print("   POST /api/analyze          - File upload")
#     print("   POST /api/analyze-text     - Text input")
#     print("="*80 + "\n")
    
#     app.run(debug=True, host='0.0.0.0', port=5001)

# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import numpy as np
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF
import traceback
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080", "http://127.0.0.1:8080", "*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 12 * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("models", exist_ok=True)

# Global variables
model = None
vectorizer = None
model_status = "NOT_INITIALIZED"

# ────────────────────────────────────────────────
#  MODEL LOADING + AUTO TRAINING
# ────────────────────────────────────────────────

print("\n" + "═"*80)
print(" MODEL LOADING & AUTO-TRAINING ".center(80, "═"))
print("═"*80 + "\n")

# Priority 1: Try to load your best saved model (retrained one)
try:
    model_path = os.path.join("models", "retrained_model.pkl")
    vec_path   = os.path.join("models", "retrained_vectorizer.pkl")

    if os.path.exists(model_path) and os.path.exists(vec_path):
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        with open(vec_path, "rb") as f:
            vectorizer = pickle.load(f)
        
        if hasattr(model, 'classes_'):
            model_status = "LOADED_RETRAINED_MODEL"
            print("SUCCESS: Loaded your retrained model + vectorizer")
            print(f"   Model type: {type(model).__name__}")
            print(f"   Classes: {model.classes_}")
        else:
            print("Loaded file but model is not fitted → will train new one")
    else:
        print("No retrained_model.pkl + vectorizer found → will try model.pkl")

except Exception as e:
    print(f"Error loading retrained model: {str(e)}")

# Priority 2: Try original model.pkl if retrained not available
if model_status == "NOT_INITIALIZED":
    try:
        model_path = os.path.join("models", "model.pkl")
        vec_path   = os.path.join("models", "vectorizer.pkl")

        if os.path.exists(model_path):
            with open(model_path, "rb") as f:
                model = pickle.load(f)
            
            if hasattr(model, 'classes_'):
                model_status = "LOADED_ORIGINAL_MODEL"
                print("SUCCESS: Loaded original model.pkl")
                if os.path.exists(vec_path):
                    with open(vec_path, "rb") as f:
                        vectorizer = pickle.load(f)
                    print("   Vectorizer also loaded")
            else:
                print("model.pkl exists but not fitted → will train new one")
        else:
            print("No model.pkl found → will train new one")
    except Exception as e:
        print(f"Error loading model.pkl: {str(e)}")

# Priority 3: If still no good model → train a real (small) one automatically
if model_status in ["NOT_INITIALIZED", "LOADED_BUT_NOT_FITTED"]:
    print("\nTraining a real Naive Bayes model automatically (small but real ML)...")
    try:
        # More realistic training data (better than your previous 10 examples)
        X_train = [
            "URGENT! Pay registration fee ₹2000 now WhatsApp +91 9876543210",
            "Send ₹5000 security deposit to confirm job immediate joining",
            "Congratulations you won lottery, pay fee to claim prize job",
            "Work from home earn ₹50000/month pay processing fee",
            "Pay ₹999 for software access copy paste job work home",
            "Senior Software Engineer Google salary $150k no fees apply official site",
            "Python Developer remote Accenture 18-25 LPA standard interview process",
            "Job offer Developer position offer letter attached no payment required",
            "Full stack role TCS Bangalore CTC 20 LPA apply careers.tcs.com",
            "Data entry job ₹30000/month no investment direct company joining"
        ]
        y_train = [1,1,1,1,1, 0,0,0,0,0]  # 1 = scam, 0 = genuine

        vectorizer = CountVectorizer(
            lowercase=True,
            stop_words='english',
            min_df=1,
            binary=False
        )
        X_train_vec = vectorizer.fit_transform(X_train)

        model = MultinomialNB(alpha=0.5)  # slight smoothing
        model.fit(X_train_vec, y_train)

        model_status = "AUTO_TRAINED_MODEL"
        print("Auto-trained real Naive Bayes model (10 examples)")
        print(f"   Vocabulary size: {len(vectorizer.vocabulary_)}")

        # Optional: save it so next time it loads faster
        with open("models/auto_trained_model.pkl", "wb") as f:
            pickle.dump(model, f)
        with open("models/auto_trained_vectorizer.pkl", "wb") as f:
            pickle.dump(vectorizer, f)
        print("   Saved as auto_trained_model.pkl + vectorizer")

    except Exception as e:
        print(f"Auto-training failed: {str(e)}")
        model = None
        vectorizer = None
        model_status = "FAILED_COMPLETELY"

print(f"\nFINAL MODEL STATUS: {model_status}")
print("═"*80 + "\n")

# ────────────────────────────────────────────────
#  PREDICTION LOGIC (always try ML first)
# ────────────────────────────────────────────────

def predict_job_text(text):
    if model is None or vectorizer is None:
        return {
            "trust_score": 50,
            "prob_scam": 0.5,
            "status": "unknown",
            "warnings": ["CRITICAL: No model available at all"],
            "positive_indicators": [],
            "model_used": "NO_MODEL_FALLBACK",
            "is_real_model": False
        }

    try:
        # Use vectorizer if available (preferred)
        if vectorizer:
            features = vectorizer.transform([text])
        else:
            # Very basic fallback features (only if vectorizer missing)
            text_lower = text.lower()
            features = np.array([[
                text_lower.count("urgent"), text_lower.count("pay"),
                text_lower.count("fee"), text_lower.count("whatsapp"),
                text_lower.count("money"), text_lower.count("register"),
                text_lower.count("deposit"), len(text.split())
            ]])

        # Predict
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0] if hasattr(model, 'predict_proba') else [0.5, 0.5]

        # Assuming class 1 = scam, class 0 = genuine
        prob_scam = probabilities[1] if len(probabilities) > 1 else 0.5
        trust_score = int(round((1 - prob_scam) * 100))

        warnings = []
        if trust_score < 40:
            warnings.append(f"High risk (model confidence {prob_scam:.0%} scam)")
        elif trust_score < 70:
            warnings.append(f"Medium risk (model confidence {prob_scam:.0%} scam)")
        else:
            warnings.append(f"Low risk (model confidence {1-prob_scam:.0%} scam)")

        # Extra context clues
        lower_text = text.lower()
        if any(word in lower_text for word in ["pay", "fee", "deposit", "registration", "urgent", "whatsapp"]):
            warnings.append("Suspicious keywords found")

        positive = []
        if trust_score >= 70:
            positive.append("Model predicts genuine with good confidence")

        return {
            "trust_score": trust_score,
            "prob_scam": prob_scam,
            "status": "genuine" if trust_score >= 70 else "caution" if trust_score >= 40 else "scam",
            "warnings": warnings[:4],
            "positive_indicators": positive,
            "model_used": model_status,
            "is_real_model": "MODEL" in model_status,
            "prediction_class": int(prediction)
        }

    except Exception as e:
        print(f"Prediction failed: {str(e)}")
        return {
            "trust_score": 50,
            "prob_scam": 0.5,
            "status": "error",
            "warnings": [f"Prediction error: {str(e)}"],
            "positive_indicators": [],
            "model_used": model_status,
            "is_real_model": False
        }

# ────────────────────────────────────────────────
#  SELF-TEST AT STARTUP
# ────────────────────────────────────────────────

def run_startup_test():
    print("\n" + "═"*80)
    print(" AUTO MODEL QUALITY TEST (real predictions) ".center(80, "═"))
    print("═"*80 + "\n")

    test_cases = [
        ("STRONG SCAM", "URGENT! Pay ₹5000 registration fee via WhatsApp +91 9876543210 or lose job offer forever"),
        ("CLEAR LEGIT", "Senior Full Stack Developer position at Infosys. CTC 18-24 LPA. 4+ years React/Node. Apply only via official careers.infosys.com. No fees."),
        ("BORDERLINE", "Work from home data entry ₹40000/month. One time ₹799 verification charge. Contact HR WhatsApp only.")
    ]

    for name, text in test_cases:
        print(f"Test: {name}")
        print(f"Text: {text[:90]}{'...' if len(text)>90 else ''}")
        result = predict_job_text(text)
        print(f"  → Model: {'REAL ML' if result['is_real_model'] else 'NO REAL MODEL'}")
        print(f"  → Status: {result['status'].upper()}")
        print(f"  → Trust Score: {result['trust_score']}")
        print(f"  → Prob Scam: {round(result['prob_scam']*100, 1)}%")
        print(f"  → Model used: {result['model_used']}")
        print(f"  → Warnings: {', '.join(result['warnings'])}")
        print("─"*70 + "\n")

# ────────────────────────────────────────────────
#  ENDPOINTS
# ────────────────────────────────────────────────

@app.route('/health')
def health():
    return jsonify({
        "status": "ok",
        "model_status": model_status,
        "using_real_model": "MODEL" in model_status,
        "model_type": type(model).__name__ if model else "None"
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if 'files' not in request.files:
        return jsonify({"error": "No files"}), 400

    files = request.files.getlist('files')
    if not files or files[0].filename == '':
        return jsonify({"error": "No files selected"}), 400

    saved_paths = []
    texts = []

    try:
        for file in files:
            if allowed_file(file.filename):
                filename = secure_filename(file.filename)
                path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(path)
                saved_paths.append(path)
                text = extract_text(path)
                if text:
                    texts.append(text)

        combined = "\n\n".join(texts) if texts else "No text extracted"
        prediction = predict_job_text(combined)

        result = {
            "trustScore": prediction["trust_score"],
            "status": prediction["status"],
            "probability_scam_percent": round(prediction["prob_scam"] * 100, 1),
            "warnings": prediction["warnings"],
            "positive_indicators": prediction["positive_indicators"],
            "recommendations": [
                "Verify company on official website",
                "Never pay money for job",
                "Use official email/contact",
                "Search for scam reports"
            ],
            "model_used": prediction["model_used"],
            "is_real_model": prediction["is_real_model"]
        }

        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        for p in saved_paths:
            try:
                if os.path.exists(p):
                    os.remove(p)
            except:
                pass

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    if not request.is_json:
        return jsonify({"error": "JSON required"}), 400

    data = request.get_json()
    text = data.get('text', '').strip()

    if not text:
        return jsonify({"error": "No text"}), 400

    prediction = predict_job_text(text)

    result = {
        "trustScore": prediction["trust_score"],
        "status": prediction["status"],
        "probability_scam_percent": round(prediction["prob_scam"] * 100, 1),
        "warnings": prediction["warnings"],
        "positive_indicators": prediction["positive_indicators"],
        "recommendations": [
            "Verify company on official website",
            "Never pay money for job",
            "Use official email/contact",
            "Search for scam reports"
        ],
        "model_used": prediction["model_used"],
        "is_real_model": prediction["is_real_model"]
    }

    return jsonify(result), 200

@app.route('/debug/model-status', methods=['GET'])
def debug_model():
    return jsonify({
        "model_status": model_status,
        "using_real_model": "MODEL" in model_status,
        "model_type": type(model).__name__ if model else None,
        "has_vectorizer": vectorizer is not None
    })

@app.route('/api/self-test', methods=['GET'])
def manual_test():
    run_startup_test()
    return jsonify({"message": "Test results printed in console"})

def extract_text(filepath):
    text = ""
    try:
        if filepath.lower().endswith('.pdf'):
            doc = fitz.open(filepath)
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()
    except:
        pass
    return text.strip()[:15000]

# ────────────────────────────────────────────────
#  START SERVER + RUN TEST
# ────────────────────────────────────────────────

if __name__ == '__main__':
    print("\n" + "═"*80)
    print(" STARTING SERVER + RUNNING MODEL TEST ".center(80, "═"))
    print("═"*80 + "\n")

    run_startup_test()

    print("Server ready → http://localhost:5001")
    print("Try /api/analyze-text with JSON { \"text\": \"your job text\" }")
    print("═"*80 + "\n")

    app.run(debug=True, host='0.0.0.0', port=5001)