from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import json
import re
import time
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

app = FastAPI(title="JSE AI Mastery API")

# CORS
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# LLM Config
API_KEY = os.getenv("EMERGENT_LLM_KEY")
MODEL_PROVIDER = "anthropic"
MODEL_NAME = "claude-4-sonnet-20250514"

# Rate limiting
request_times = {}
RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX = 10

def check_rate_limit(ip: str):
    now = time.time()
    if ip not in request_times:
        request_times[ip] = []
    request_times[ip] = [t for t in request_times[ip] if now - t < RATE_LIMIT_WINDOW]
    if len(request_times[ip]) >= RATE_LIMIT_MAX:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait a moment.")
    request_times[ip].append(now)

def parse_json_response(response_text: str) -> dict:
    """Parse JSON from LLM response, handling markdown fences."""
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        json_match = re.search(r'\{[\s\S]*\}', str(response_text))
        if json_match:
            return json.loads(json_match.group())
        raise ValueError("Could not parse JSON from response")

# ─── Models ─────────────────────────────────────────────────────────

class CouncilRequest(BaseModel):
    question: str

class BicameralRequest(BaseModel):
    draft: str
    context: Optional[str] = "professional AI education content"

class ProgressUpdate(BaseModel):
    exercise_id: str
    score: Optional[int] = None
    completed: bool = False
    data: Optional[dict] = None

# ─── Health ──────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "JSE AI Mastery API"}

# ─── Council of Experts ──────────────────────────────────────────────

@app.post("/api/ai/council")
async def council_of_experts(req: CouncilRequest, request: Request):
    check_rate_limit(request.client.host)
    if not req.question or len(req.question.strip()) < 5:
        raise HTTPException(status_code=400, detail="Question must be at least 5 characters")
    
    system_message = """You are the Council of Experts engine for Jack Stallion Enterprise's AI Mastery course.

When given a question or decision, you MUST respond with ONLY valid JSON (no markdown, no code fences, no extra text).

The JSON must follow this exact structure:
{
  "optimist": {
    "title": "The Optimist",
    "icon": "sun",
    "perspective": "2-3 sentence best-case analysis focusing on opportunities and potential"
  },
  "skeptic": {
    "title": "The Skeptic",
    "icon": "shield",
    "perspective": "2-3 sentence risk and challenge analysis"
  },
  "strategist": {
    "title": "The Strategist",
    "icon": "target",
    "perspective": "2-3 sentence strategic path forward with sequencing"
  },
  "community": {
    "title": "Community Voice",
    "icon": "users",
    "perspective": "2-3 sentence stakeholder impact analysis"
  },
  "synthesis": "3-4 sentence balanced recommendation integrating all four perspectives with a clear action step"
}

CRITICAL: Return ONLY the JSON object. No markdown, no code fences, no text before or after."""

    try:
        chat = LlmChat(
            api_key=API_KEY,
            session_id=f"council-{int(time.time())}-{hash(req.question) % 10000}",
            system_message=system_message
        ).with_model(MODEL_PROVIDER, MODEL_NAME)
        
        response = await chat.send_message(UserMessage(text=req.question))
        data = parse_json_response(response)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Council encountered an issue: {str(e)}")

# ─── Bicameral Pipeline ─────────────────────────────────────────────

@app.post("/api/ai/bicameral/verify")
async def bicameral_verify(req: BicameralRequest, request: Request):
    check_rate_limit(request.client.host)
    if not req.draft or len(req.draft.strip()) < 10:
        raise HTTPException(status_code=400, detail="Draft must be at least 10 characters")
    
    system_message = """You are STDIO — the Verification Layer of the ORSON Bicameral Pipeline for Jack Stallion Enterprise.

Your job: rigorously evaluate content against quality standards. You are ruthlessly honest.

Scoring rubric:
- 10/10: Indistinguishable from best manually written content
- 7/10: Publishable with minor adjustments
- 4/10: Requires significant rewriting
- 1/10: Fundamentally flawed

You MUST respond with ONLY valid JSON (no markdown, no code fences, no extra text):
{
  "score": <integer 1-10>,
  "pass": <boolean, true if score >= 7>,
  "strengths": ["strength 1", "strength 2"],
  "violations": ["violation 1", "violation 2"],
  "fixes": ["specific fix 1", "specific fix 2"],
  "summary": "2-3 sentence overall assessment"
}

CRITICAL: Return ONLY the JSON object."""

    try:
        chat = LlmChat(
            api_key=API_KEY,
            session_id=f"bicameral-{int(time.time())}-{hash(req.draft) % 10000}",
            system_message=system_message
        ).with_model(MODEL_PROVIDER, MODEL_NAME)
        
        prompt = f"Evaluate this draft for {req.context}:\n\n{req.draft}"
        response = await chat.send_message(UserMessage(text=prompt))
        data = parse_json_response(response)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification encountered an issue: {str(e)}")

# ─── Progress Tracking ───────────────────────────────────────────────

@app.post("/api/progress")
async def save_progress(update: ProgressUpdate):
    """Save exercise progress (anonymous for now, will add auth later)."""
    doc = {
        "exercise_id": update.exercise_id,
        "score": update.score,
        "completed": update.completed,
        "data": update.data or {},
        "timestamp": time.time()
    }
    await db.progress.update_one(
        {"exercise_id": update.exercise_id},
        {"$set": doc},
        upsert=True
    )
    return {"success": True}

@app.get("/api/progress")
async def get_progress():
    """Get all progress entries."""
    cursor = db.progress.find({}, {"_id": 0})
    progress = await cursor.to_list(length=100)
    return {"progress": progress}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
