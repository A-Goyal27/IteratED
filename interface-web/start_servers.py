#!/usr/bin/env python3
"""
Startup script for IteratED - runs both Python backend and Next.js frontend
"""

import subprocess
import sys
import time
import os
from threading import Thread

def run_backend():
    """Run the Python FastAPI backend server"""
    print("🚀 Starting Python backend server...")
    try:
        subprocess.run([sys.executable, "backend_integration.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

def run_frontend():
    """Run the Next.js frontend server"""
    print("🎨 Starting Next.js frontend server...")
    try:
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")

def main():
    print("🎓 IteratED - Starting both servers...")
    print("=" * 50)
    
    # Check if config.py exists and has proper API keys
    if os.path.exists("config.py"):
        with open("config.py", "r") as f:
            config_content = f.read()
            if "your_gemini_key_here" in config_content or "your_openai_key_here" in config_content:
                print("⚠️  Warning: Please set your API keys in config.py before starting the servers")
                print("   - Edit config.py and replace 'your_gemini_key_here' with your actual Gemini API key")
                print("   - Edit config.py and replace 'your_openai_key_here' with your actual OpenAI API key")
                print()
    
    # Start backend server in a separate thread
    backend_thread = Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    time.sleep(2)
    
    # Start frontend server
    run_frontend()

if __name__ == "__main__":
    main() 