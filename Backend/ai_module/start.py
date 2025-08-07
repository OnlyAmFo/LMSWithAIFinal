#!/usr/bin/env python3
"""
Startup script for the LMS AI Performance Analysis Module
"""

import uvicorn
import sys
import os
from pathlib import Path

def main():
    """Main startup function"""
    try:
        print("🚀 Starting LMS AI Performance Analysis Module...")
        print("📍 Service will be available at: http://localhost:8001")
        print("📚 API Documentation: http://localhost:8001/docs")
        print("🔍 Health Check: http://localhost:8001/health")
        print("-" * 50)
        
        # Start the FastAPI server
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8001,
            reload=True,
            log_level="info"
        )
        
    except KeyboardInterrupt:
        print("\n🛑 Service stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 