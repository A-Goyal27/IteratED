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

# Import your existing Tutor classes
from Tutor import TutorGemini, TutorOpenAI

# Initialize FastAPI app
app = FastAPI(title="IteratED API", version="1.0.0")

# Add CORS middleware to allow requests from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js development server
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
                if not request.api_key:
                    raise HTTPException(status_code=400, detail="API key required for Gemini")
                tutor_sessions[request.sessionId] = TutorGemini(
                    key=request.api_key,
                    question=request.question,
                    answer=request.answer
                )
            elif request.model_type.lower() == "openai":
                if not request.api_key:
                    raise HTTPException(status_code=400, detail="API key required for OpenAI")
                tutor_sessions[request.sessionId] = TutorOpenAI(
                    key=request.api_key,
                    question=request.question,
                    answer=request.answer
                )
            else:
                raise HTTPException(status_code=400, detail="Invalid model type")

        # Get the tutor for this session
        tutor = tutor_sessions[request.sessionId]
        
        # Send the message to the tutor
        response = tutor.chat(request.message)
        
        return ChatResponse(
            success=True,
            message=response,
            timestamp=asyncio.get_event_loop().time()
        )
        
    except Exception as e:
        return ChatResponse(
            success=False,
            message="",
            timestamp=asyncio.get_event_loop().time(),
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
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 