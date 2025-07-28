# 🔑 API Key Setup Guide

## Current Status: Demo Mode ✅

Your IteratED interface is now working in **demo mode**! You can test the interface and chat functionality without an API key.

## 🚀 How to Get API Keys

### Option 1: Google Gemini (Recommended)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### Option 2: OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account
3. Click "Create new secret key"
4. Copy the generated key

## 🔧 How to Add Your API Key

1. **Edit the config file:**
   ```bash
   nano config.py
   # or
   open config.py
   ```

2. **Replace the placeholder with your actual key:**
   ```python
   # Change this line:
   GEMINI_API_KEY = "your_gemini_key_here"
   
   # To this (example):
   GEMINI_API_KEY = "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz"
   ```

3. **Restart the backend server:**
   ```bash
   # Stop the current server
   pkill -f "backend_integration.py"
   
   # Start it again
   python3 backend_integration.py &
   ```

## 🎯 Test Your Setup

1. Go to `http://localhost:3000`
2. Enter a question and start a session
3. If you see AI responses, your API key is working!

## 🔒 Security Notes

- Never commit your API keys to version control
- Keep your keys private and secure
- Consider using environment variables for production

## 🆘 Troubleshooting

### "Invalid API Key" Error
- Double-check your key is copied correctly
- Ensure there are no extra spaces
- Verify the key is active in your account

### "Rate Limit Exceeded" Error
- You've hit your API usage limits
- Check your account dashboard for usage
- Consider upgrading your plan

### Still Getting Demo Responses
- Make sure you restarted the backend server
- Check that the config.py file was saved
- Verify the API key format is correct

---

**💡 Tip:** Start with a small test question to verify everything is working before using the full system! 