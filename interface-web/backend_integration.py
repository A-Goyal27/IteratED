"""
Backend Integration for IteratED Next.js Interface

This file shows how to integrate your existing Tutor classes with the Next.js frontend.
You can use this as a reference to create a proper API server.
"""

import sys
import os
import json
from typing import Dict, Any
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Add the parent directory to the path to import your Tutor classes
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import your existing Tutor classes (using fixed version)
from tutor_fixed import TutorGemini, TutorOpenAI

# Initialize FastAPI app
app = FastAPI(title="IteratED API", version="1.0.0")

# Import configuration
from config import ALLOWED_ORIGINS, GEMINI_API_KEY, OPENAI_API_KEY, HOST, PORT

# Add CORS middleware to allow requests from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class ChatRequest(BaseModel):
    message: str
    question: str
    answer: str = ""
    sessionId: str
    model_type: str = "gemini"  # "gemini" or "openai"
    api_key: str = ""

class ChatResponse(BaseModel):
    success: bool
    message: str
    timestamp: str
    error: str = None

# Store active tutor sessions
tutor_sessions: Dict[str, Any] = {}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Check if session exists, create new one if not
        if request.sessionId not in tutor_sessions:
            # Initialize the appropriate tutor based on model type
            if request.model_type.lower() == "gemini":
                api_key = request.api_key if request.api_key else GEMINI_API_KEY
                if api_key == "your_gemini_key_here":
                    # Provide a demo response instead of throwing an error
                    return ChatResponse(
                        success=True,
                        message="Welcome to IteratED! This is a demo mode since no API key is configured. To use the full AI tutor, please add your Gemini API key to config.py. For now, I'll provide Socratic-style responses to help you learn. What would you like to explore about your question?",
                        timestamp=str(asyncio.get_event_loop().time())
                    )
                tutor_sessions[request.sessionId] = TutorGemini(
                    key=api_key,
                    question=request.question,
                    answer=request.answer
                )
            elif request.model_type.lower() == "openai":
                api_key = request.api_key if request.api_key else OPENAI_API_KEY
                if api_key == "your_openai_key_here":
                    # Provide a demo response instead of throwing an error
                    return ChatResponse(
                        success=True,
                        message="Welcome to IteratED! This is a demo mode since no API key is configured. To use the full AI tutor, please add your OpenAI API key to config.py. For now, I'll provide Socratic-style responses to help you learn. What would you like to explore about your question?",
                        timestamp=str(asyncio.get_event_loop().time())
                    )
                tutor_sessions[request.sessionId] = TutorOpenAI(
                    key=api_key,
                    question=request.question,
                    answer=request.answer
                )
            else:
                raise HTTPException(status_code=400, detail="Invalid model type")

        # Check if we're in demo mode (no API key configured)
        if request.model_type.lower() == "gemini" and GEMINI_API_KEY == "your_gemini_key_here":
            # Demo mode responses
            demo_responses = [
                "That's an interesting perspective! Can you tell me more about how you arrived at that conclusion?",
                "I see you're thinking about this step by step. What would happen if we tried a different approach?",
                "You're on the right track! Let me ask you this: what do you think is the key concept here?",
                "Great thinking! Now, can you connect this to the main question we're working on?",
                "I like how you're breaking this down. What's the next logical step in your reasoning?",
                "That's a good start! What other factors should we consider in this problem?",
                "Interesting approach! How would you test if your understanding is correct?",
                "You're making good progress! What questions do you still have about this topic?"
            ]
            import random
            response = random.choice(demo_responses)
        else:
            # Get the tutor for this session
            tutor = tutor_sessions[request.sessionId]
            
            # Send the message to the tutor
            response = tutor.chat(request.message)
        
        return ChatResponse(
            success=True,
            message=response,
            timestamp=str(asyncio.get_event_loop().time())
        )
        
    except Exception as e:
        return ChatResponse(
            success=False,
            message="",
            timestamp=str(asyncio.get_event_loop().time()),
            error=str(e)
        )

@app.delete("/api/session/{session_id}")
async def end_session(session_id: str):
    """End a tutoring session and clean up resources"""
    if session_id in tutor_sessions:
        del tutor_sessions[session_id]
    return {"success": True, "message": "Session ended"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "active_sessions": len(tutor_sessions)}

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "backend_integration:app",
        host=HOST,
        port=PORT,
        reload=True
    ) 