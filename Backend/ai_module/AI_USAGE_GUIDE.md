# 🧠 LMS AI System - Complete Usage Guide

## 📋 Table of Contents

1. [How to Use the AI](#how-to-use-the-ai)
2. [How to Train the AI](#how-to-train-the-ai)
3. [How to Populate with Data](#how-to-populate-with-data)
4. [AI Features Overview](#ai-features-overview)
5. [Integration Steps](#integration-steps)
6. [Advanced Customization](#advanced-customization)

---

## 🎯 How to Use the AI

### **Current AI System (Rule-Based)**

Your AI is already working with intelligent analysis:

```bash
# Test current AI features
curl http://localhost:5000/api/v1/ai/test/student/student1/performance
curl http://localhost:5000/api/v1/ai/test/class/class1/performance
curl http://localhost:5000/api/v1/ai/test/class/class1/at-risk
```

### **Enhanced AI System (Machine Learning)**

To use the enhanced ML-powered AI:

1. **Train the models first** (see training section below)
2. **Use the EnhancedLMSAI class** for predictions
3. **Get accurate performance predictions** and risk assessments

---

## 🧠 How to Train the AI

### **Step 1: Generate Training Data**

```bash
cd Backend/ai_module
python data_generator.py
```

This creates realistic student data for training.

### **Step 2: Train the Models**

```bash
python train_ai.py
```

This will:

- Generate 150 students (5 classes × 30 students)
- Train performance prediction model
- Train risk classification model
- Save models to `models/` directory

### **Step 3: Test the Models**

```bash
python train_ai.py test
```

This tests the trained models with sample data.

---

## 📊 How to Populate with Data

### **Option 1: Generate Synthetic Data (Recommended for Testing)**

```python
from data_generator import LMSDataGenerator

generator = LMSDataGenerator()
training_data = generator.generate_multiple_classes(
    num_classes=5,
    students_per_class=30
)
generator.save_data(training_data, "my_training_data.json")
```

### **Option 2: Use Real Database Data**

When your friend sets up the database:

```python
# Replace mock data with real database queries
import prisma

# Get real student scores from database
student_scores = await prisma.assignment.findMany({
    where: { studentId: student_id },
    include: { course: true }
})

# Convert to AI format
ai_data = convert_to_ai_format(student_scores)
```

### **Option 3: Import CSV/Excel Data**

```python
import pandas as pd

# Load from CSV
df = pd.read_csv('student_scores.csv')
training_data = convert_dataframe_to_ai_format(df)
```

---

## 🚀 AI Features Overview

### **1. Performance Prediction**

- **What it does**: Predicts future student performance
- **Input**: Historical scores, trends, patterns
- **Output**: Predicted score range and confidence

### **2. Risk Assessment**

- **What it does**: Identifies at-risk students
- **Input**: Performance patterns, trends, variance
- **Output**: Risk level (low/medium/high) with reasons

### **3. Trend Analysis**

- **What it does**: Analyzes performance trends over time
- **Input**: Time-series score data
- **Output**: Improving/declining/stable patterns

### **4. Topic Analysis**

- **What it does**: Identifies weak and strong topics
- **Input**: Topic-wise scores
- **Output**: Topic recommendations and focus areas

---

## 🔗 Integration Steps

### **Step 1: Update Main AI Service**

Replace the current rule-based logic with ML models:

```python
# In main.py, add:
from enhanced_ai import EnhancedLMSAI

ai = EnhancedLMSAI()
ai.load_models()  # Load trained models

# Use for predictions
predicted_performance = ai.predict_student_performance(student_scores)
risk_level = ai.predict_student_risk(student_scores)
```

### **Step 2: Update Backend Controllers**

Modify `ai.controller.js` to use enhanced predictions:

```javascript
// Add ML predictions to existing analysis
const enhancedAnalysis = {
  ...basicAnalysis,
  ml_predictions: {
    predicted_performance: predictedScore,
    confidence_level: confidence,
    risk_assessment: riskLevel,
  },
};
```

### **Step 3: Frontend Integration**

Update React components to display ML insights:

```jsx
// In AIPerformanceCard.tsx
<div className="ml-predictions">
  <h3>AI Predictions</h3>
  <p>Predicted Performance: {data.ml_predictions.predicted_performance}</p>
  <p>Confidence: {data.ml_predictions.confidence_level}%</p>
  <p>Risk Level: {data.ml_predictions.risk_assessment}</p>
</div>
```

---

## ⚙️ Advanced Customization

### **Custom Training Data**

```python
# Create custom student profiles
custom_data = {
    "excellent_student": generate_student_scores("student1", 15, "excellent"),
    "struggling_student": generate_student_scores("student2", 15, "struggling"),
    "improving_student": generate_student_scores("student3", 15, "improving")
}
```

### **Model Parameters**

```python
# Customize model parameters
ai = EnhancedLMSAI()
ai.performance_model = RandomForestRegressor(
    n_estimators=200,  # More trees for better accuracy
    max_depth=10,      # Control tree depth
    random_state=42
)
```

### **Feature Engineering**

Add custom features to improve predictions:

```python
# Add custom features
def calculate_custom_features(scores):
    return {
        'consistency': calculate_consistency(scores),
        'improvement_rate': calculate_improvement_rate(scores),
        'difficulty_adjustment': calculate_difficulty_adjustment(scores)
    }
```

---

## 📈 Performance Monitoring

### **Model Accuracy Tracking**

```python
# Monitor model performance
def evaluate_model_performance():
    test_predictions = model.predict(test_features)
    accuracy = calculate_accuracy(test_predictions, actual_values)
    print(f"Model Accuracy: {accuracy:.2f}%")
```

### **Retraining Schedule**

```python
# Retrain models periodically
def schedule_retraining():
    # Retrain every month with new data
    if should_retrain():
        ai.train_models(new_training_data)
        ai.save_models()
```

---

## 🎯 Quick Start Commands

```bash
# 1. Generate training data
cd Backend/ai_module
python data_generator.py

# 2. Train AI models
python train_ai.py

# 3. Test models
python train_ai.py test

# 4. Start AI service
python main.py

# 5. Test API endpoints
curl http://localhost:8001/health
curl http://localhost:5000/api/v1/ai/test/student/student1/performance
```

---

## 🔧 Troubleshooting

### **Common Issues:**

1. **"No trained models found"**

   - Solution: Run `python train_ai.py` first

2. **"Insufficient training data"**

   - Solution: Generate more data with `python data_generator.py`

3. **"Model accuracy is low"**

   - Solution: Add more diverse training data
   - Try different model parameters

4. **"API endpoints not working"**
   - Solution: Ensure both AI service (port 8001) and backend (port 5000) are running

---

## 📞 Support

For questions or issues:

1. Check the logs in the terminal
2. Verify all services are running
3. Ensure training data is properly formatted
4. Test with the provided sample data first

---

**🎉 Your AI system is now ready for production use!**
