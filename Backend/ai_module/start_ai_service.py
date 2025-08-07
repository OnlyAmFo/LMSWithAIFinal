#!/usr/bin/env python3
"""
Start AI Service with Trained Models
This script ensures the AI models are trained and starts the FastAPI service
"""

import os
import sys
from enhanced_ai import EnhancedLMSAI
from data_generator import LMSDataGenerator
import uvicorn
from main import app

def train_models_if_needed():
    """Train models if they don't exist or are outdated"""
    ai = EnhancedLMSAI()
    
    # Check if models exist
    models_exist = (
        os.path.exists("models/performance_model.pkl") and
        os.path.exists("models/risk_model.pkl") and
        os.path.exists("models/scaler.pkl")
    )
    
    if not models_exist:
        print("🧠 Training AI models...")
        
        # Generate training data
        generator = LMSDataGenerator()
        training_data = generator.generate_multiple_classes(
            num_classes=5, 
            students_per_class=30
        )
        
        # Train models
        success = ai.train_models(training_data)
        
        if success:
            print("✅ Models trained successfully!")
            ai.save_models()
        else:
            print("❌ Failed to train models")
            return False
    else:
        print("✅ Pre-trained models found")
    
    return True

def main():
    print("🚀 Starting LMS AI Service with ML Capabilities")
    print("=" * 50)
    
    # Train models if needed
    if not train_models_if_needed():
        print("❌ Failed to prepare AI models")
        sys.exit(1)
    
    print("\n🔧 Starting FastAPI server...")
    print("📍 Service will be available at: http://localhost:8001")
    print("📚 API Documentation: http://localhost:8001/docs")
    print("🔍 Health Check: http://localhost:8001/health")
    
    # Start the server
    uvicorn.run(app, host="0.0.0.0", port=8001)

if __name__ == "__main__":
    main() 