"""
Configuration file for IteratED API keys and settings
"""

# API Keys - Replace with your actual keys
GEMINI_API_KEY = "AIzaSyDB0Qg8bA39_AZKAWH2oQPqTqHrdhArz-4"
OPENAI_API_KEY = "your_openai_key_here"

# Server Configuration
HOST = "0.0.0.0"
PORT = 8000

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Default Model Configuration
DEFAULT_MODEL = "gemini"  # "gemini" or "openai" 