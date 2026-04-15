from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional
import os
import json
import re
import time
import secrets
import asyncio
from datetime import datetime, timedelta
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage
from jose import jwt, JWTError

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

# Auth Config
JWT_SECRET = os.getenv("JWT_SECRET", secrets.token_hex(32))
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 72
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://prompt-genius-hub.preview.emergentagent.com")

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

def serialize_doc(doc):
    """Serialize MongoDB document for JSON response."""
    if doc is None:
        return None
    serialized = {}
    for key, value in doc.items():
        if key == '_id':
            serialized[key] = str(value)
        elif isinstance(value, datetime):
            serialized[key] = value.isoformat()
        elif isinstance(value, dict):
            serialized[key] = serialize_doc(value)
        elif isinstance(value, list):
            serialized[key] = [serialize_doc(v) if isinstance(v, dict) else str(v) if isinstance(v, datetime) else v for v in value]
        else:
            serialized[key] = value
    return serialized

# ─── JWT Helpers ──────────────────────────────────────────────────────────

def create_jwt_token(user_data: dict) -> str:
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HOURS)
    payload = {
        "sub": user_data.get("email", ""),
        "name": user_data.get("name", ""),
        "picture": user_data.get("picture", ""),
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        return None

async def get_current_user(request: Request) -> Optional[dict]:
    """Extract user from Authorization header or return None."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        payload = decode_jwt_token(token)
        if payload:
            return {"email": payload.get("sub"), "name": payload.get("name"), "picture": payload.get("picture")}
    return None

# ─── Models ───────────────────────────────────────────────────────────

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

class TestLoginRequest(BaseModel):
    email: str
    name: Optional[str] = "Test User"

# ─── Health ───────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "JSE AI Mastery API"}

# ─── Auth - Google OAuth via Emergent ─────────────────────────────────

@app.get("/api/auth/google/start")
async def google_auth_start():
    """Start Google OAuth flow using Emergent-managed auth."""
    try:
        from emergentintegrations.auth.google import GoogleSSO
        callback_url = f"{FRONTEND_URL}/api/auth/google/callback"
        google_sso = GoogleSSO(redirect_uri=callback_url)
        auth_url = await google_sso.get_authorization_url()
        return {"url": auth_url}
    except Exception as e:
        # Fallback: return error
        raise HTTPException(status_code=500, detail=f"Could not start auth: {str(e)}")

@app.get("/api/auth/google/callback")
async def google_auth_callback(code: str = None, state: str = None):
    """Handle Google OAuth callback."""
    if not code:
        raise HTTPException(status_code=400, detail="No authorization code provided")
    try:
        from emergentintegrations.auth.google import GoogleSSO
        callback_url = f"{FRONTEND_URL}/api/auth/google/callback"
        google_sso = GoogleSSO(redirect_uri=callback_url)
        user_info = await google_sso.verify_and_process(code)
        
        email = user_info.get("email", "")
        name = user_info.get("name", email.split("@")[0])
        picture = user_info.get("picture", "")
        
        # Upsert user in MongoDB
        await db.users.update_one(
            {"email": email},
            {"$set": {
                "email": email,
                "name": name,
                "picture": picture,
                "last_login": datetime.utcnow(),
            }, "$setOnInsert": {
                "created_at": datetime.utcnow(),
                "unlocked_tiers": [0],
            }},
            upsert=True
        )
        
        token = create_jwt_token({"email": email, "name": name, "picture": picture})
        return RedirectResponse(url=f"{FRONTEND_URL}?token={token}")
    except Exception as e:
        return RedirectResponse(url=f"{FRONTEND_URL}?auth_error={str(e)}")

# ─── Auth - Test Login Bypass ─────────────────────────────────────────

@app.post("/api/auth/test-login")
async def test_login(req: TestLoginRequest):
    """Test bypass login - creates a test user and returns JWT."""
    email = req.email
    name = req.name or email.split("@")[0]
    
    # Upsert user
    await db.users.update_one(
        {"email": email},
        {"$set": {
            "email": email,
            "name": name,
            "picture": "",
            "last_login": datetime.utcnow(),
        }, "$setOnInsert": {
            "created_at": datetime.utcnow(),
            "unlocked_tiers": [0],
        }},
        upsert=True
    )
    
    token = create_jwt_token({"email": email, "name": name, "picture": ""})
    return {"token": token, "user": {"email": email, "name": name, "picture": ""}}

# ─── Auth - Get Current User ──────────────────────────────────────────

@app.get("/api/auth/me")
async def get_me(request: Request):
    """Get current user info including progress."""
    user = await get_current_user(request)
    if not user:
        return {"authenticated": False}
    
    # Get full user from DB
    db_user = await db.users.find_one({"email": user["email"]})
    if not db_user:
        return {"authenticated": False}
    
    # Get progress
    cursor = db.progress.find({"user_email": user["email"]}, {"_id": 0})
    progress = await cursor.to_list(length=200)
    
    user_data = serialize_doc(db_user)
    return {
        "authenticated": True,
        "user": {
            "email": user_data.get("email"),
            "name": user_data.get("name"),
            "picture": user_data.get("picture", ""),
            "unlocked_tiers": user_data.get("unlocked_tiers", [0]),
            "created_at": user_data.get("created_at"),
        },
        "progress": progress,
    }

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

# ─── Bicameral Pipeline ──────────────────────────────────────────────

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

# ─── Progress Tracking (Authenticated) ────────────────────────────────

@app.post("/api/progress")
async def save_progress(update: ProgressUpdate, request: Request):
    """Save exercise progress. Works both authenticated and anonymous."""
    user = await get_current_user(request)
    user_email = user["email"] if user else "anonymous"
    
    doc = {
        "user_email": user_email,
        "exercise_id": update.exercise_id,
        "score": update.score,
        "completed": update.completed,
        "data": update.data or {},
        "timestamp": datetime.utcnow().isoformat(),
    }
    await db.progress.update_one(
        {"user_email": user_email, "exercise_id": update.exercise_id},
        {"$set": doc},
        upsert=True
    )
    return {"success": True}

@app.get("/api/progress")
async def get_progress(request: Request):
    """Get progress. Uses authenticated user if available, else anonymous."""
    user = await get_current_user(request)
    user_email = user["email"] if user else "anonymous"
    
    cursor = db.progress.find({"user_email": user_email}, {"_id": 0})
    progress = await cursor.to_list(length=200)
    return {"progress": progress}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
