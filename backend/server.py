from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional
import os
import json
import re
import time
import secrets
import httpx
import asyncio
from datetime import datetime, timedelta
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from jose import jwt, JWTError
import anthropic

load_dotenv()

app = FastAPI(title="JSE AI Mastery API")

# ─── CORS ────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── MongoDB ─────────────────────────────────────────────────────────
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME", "jse_mastery")
client    = AsyncIOMotorClient(MONGO_URL)
db        = client[DB_NAME]

# ─── Anthropic Claude ─────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
MODEL_NAME        = "claude-sonnet-4-5"
claude            = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# ─── Google OAuth ─────────────────────────────────────────────────────
GOOGLE_CLIENT_ID     = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL         = os.getenv("FRONTEND_URL", "https://jackstallionenterprise.com/app/index.html")
BACKEND_URL          = os.getenv("BACKEND_URL", "https://your-backend.onrender.com")

GOOGLE_AUTH_URL  = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USER_URL  = "https://www.googleapis.com/oauth2/v2/userinfo"
GOOGLE_SCOPES    = "openid email profile"

# ─── JWT ──────────────────────────────────────────────────────────────
JWT_SECRET     = os.getenv("JWT_SECRET", secrets.token_hex(32))
JWT_ALGORITHM  = "HS256"
JWT_EXPIRE_HRS = 72

# ─── Rate Limiting ────────────────────────────────────────────────────
request_times     = {}
RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX    = 10

# ─── Helpers ─────────────────────────────────────────────────────────

def check_rate_limit(ip: str):
    now = time.time()
    if ip not in request_times:
        request_times[ip] = []
    request_times[ip] = [t for t in request_times[ip] if now - t < RATE_LIMIT_WINDOW]
    if len(request_times[ip]) >= RATE_LIMIT_MAX:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait a moment.")
    request_times[ip].append(now)


def parse_json_response(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'\{[\s\S]*\}', str(text))
        if match:
            return json.loads(match.group())
        raise ValueError("Could not parse JSON from response")


def serialize_doc(doc):
    if doc is None:
        return None
    out = {}
    for k, v in doc.items():
        if k == "_id":
            out[k] = str(v)
        elif isinstance(v, datetime):
            out[k] = v.isoformat()
        elif isinstance(v, dict):
            out[k] = serialize_doc(v)
        elif isinstance(v, list):
            out[k] = [serialize_doc(i) if isinstance(i, dict)
                      else i.isoformat() if isinstance(i, datetime) else i for i in v]
        else:
            out[k] = v
    return out


def create_jwt_token(user_data: dict) -> str:
    expire  = datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HRS)
    payload = {
        "sub":     user_data.get("email", ""),
        "name":    user_data.get("name", ""),
        "picture": user_data.get("picture", ""),
        "exp":     expire,
        "iat":     datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_jwt_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        return None


async def get_current_user(request: Request) -> Optional[dict]:
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        payload = decode_jwt_token(auth[7:])
        if payload:
            return {
                "email":   payload.get("sub"),
                "name":    payload.get("name"),
                "picture": payload.get("picture"),
            }
    return None


async def claude_chat(system_message: str, user_message: str) -> str:
    """Call Claude API and return the text response."""
    message = claude.messages.create(
        model=MODEL_NAME,
        max_tokens=2048,
        system=system_message,
        messages=[{"role": "user", "content": user_message}],
    )
    return message.content[0].text


# ─── Models ──────────────────────────────────────────────────────────

class CouncilRequest(BaseModel):
    question: str

class BicameralRequest(BaseModel):
    draft:   str
    context: Optional[str] = "professional AI education content"

class ProgressUpdate(BaseModel):
    exercise_id: str
    score:       Optional[int] = None
    completed:   bool          = False
    data:        Optional[dict] = None

class TestLoginRequest(BaseModel):
    email: str
    name:  Optional[str] = "Test User"


# ─── Health ───────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "JSE AI Mastery API"}


# ─── Google OAuth ─────────────────────────────────────────────────────

@app.get("/api/auth/google/start")
async def google_auth_start():
    """Start Google OAuth flow — redirects user to Google consent screen."""
    callback_url = f"{BACKEND_URL}/api/auth/google/callback"
    params = (
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={callback_url}"
        f"&response_type=code"
        f"&scope={GOOGLE_SCOPES.replace(' ', '%20')}"
        f"&access_type=offline"
        f"&prompt=select_account"
    )
    return {"url": GOOGLE_AUTH_URL + params}


@app.get("/api/auth/google/callback")
async def google_auth_callback(code: str = None, state: str = None):
    """Handle Google OAuth callback, create/update user, return JWT via redirect."""
    if not code:
        return RedirectResponse(url=f"{FRONTEND_URL}?auth_error=no_code")

    callback_url = f"{BACKEND_URL}/api/auth/google/callback"

    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as http:
            token_resp = await http.post(GOOGLE_TOKEN_URL, data={
                "code":          code,
                "client_id":     GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri":  callback_url,
                "grant_type":    "authorization_code",
            })
            token_data = token_resp.json()
            access_token = token_data.get("access_token")
            if not access_token:
                raise ValueError("No access token received")

            # Fetch user info
            user_resp = await http.get(
                GOOGLE_USER_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            user_info = user_resp.json()

        email   = user_info.get("email", "")
        name    = user_info.get("name", email.split("@")[0])
        picture = user_info.get("picture", "")

        # Upsert user in MongoDB
        await db.users.update_one(
            {"email": email},
            {"$set": {
                "email":      email,
                "name":       name,
                "picture":    picture,
                "last_login": datetime.utcnow(),
            }, "$setOnInsert": {
                "created_at":     datetime.utcnow(),
                "unlocked_tiers": [0],
            }},
            upsert=True,
        )

        token = create_jwt_token({"email": email, "name": name, "picture": picture})
        return RedirectResponse(url=f"{FRONTEND_URL}?token={token}")

    except Exception as e:
        return RedirectResponse(url=f"{FRONTEND_URL}?auth_error={str(e)}")


# ─── Test Login (bypass) ──────────────────────────────────────────────

@app.post("/api/auth/test-login")
async def test_login(req: TestLoginRequest):
    email = req.email
    name  = req.name or email.split("@")[0]
    await db.users.update_one(
        {"email": email},
        {"$set": {
            "email":      email,
            "name":       name,
            "picture":    "",
            "last_login": datetime.utcnow(),
        }, "$setOnInsert": {
            "created_at":     datetime.utcnow(),
            "unlocked_tiers": [0],
        }},
        upsert=True,
    )
    token = create_jwt_token({"email": email, "name": name, "picture": ""})
    return {"token": token, "user": {"email": email, "name": name, "picture": ""}}


# ─── Current User ────────────────────────────────────────────────────

@app.get("/api/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    if not user:
        return {"authenticated": False}
    db_user = await db.users.find_one({"email": user["email"]})
    if not db_user:
        return {"authenticated": False}
    cursor   = db.progress.find({"user_email": user["email"]}, {"_id": 0})
    progress = await cursor.to_list(length=200)
    u        = serialize_doc(db_user)
    return {
        "authenticated": True,
        "user": {
            "email":          u.get("email"),
            "name":           u.get("name"),
            "picture":        u.get("picture", ""),
            "unlocked_tiers": u.get("unlocked_tiers", [0]),
            "created_at":     u.get("created_at"),
        },
        "progress": progress,
    }


# ─── Council of Experts ──────────────────────────────────────────────

@app.post("/api/ai/council")
async def council_of_experts(req: CouncilRequest, request: Request):
    check_rate_limit(request.client.host)
    if not req.question or len(req.question.strip()) < 5:
        raise HTTPException(status_code=400, detail="Question must be at least 5 characters")

    system = """You are the Council of Experts engine for Jack Stallion Enterprise's AI Mastery course.

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
        response = await asyncio.to_thread(claude_chat, system, req.question)
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

    system = """You are STDIO — the Verification Layer of the ORSON Bicameral Pipeline for Jack Stallion Enterprise.

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
        prompt   = f"Evaluate this draft for {req.context}:\n\n{req.draft}"
        response = await asyncio.to_thread(claude_chat, system, prompt)
        data     = parse_json_response(response)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification encountered an issue: {str(e)}")


# ─── Progress Tracking ────────────────────────────────────────────────

@app.post("/api/progress")
async def save_progress(update: ProgressUpdate, request: Request):
    user       = await get_current_user(request)
    user_email = user["email"] if user else "anonymous"
    doc = {
        "user_email":  user_email,
        "exercise_id": update.exercise_id,
        "score":       update.score,
        "completed":   update.completed,
        "data":        update.data or {},
        "timestamp":   datetime.utcnow().isoformat(),
    }
    await db.progress.update_one(
        {"user_email": user_email, "exercise_id": update.exercise_id},
        {"$set": doc},
        upsert=True,
    )
    return {"success": True}


@app.get("/api/progress")
async def get_progress(request: Request):
    user       = await get_current_user(request)
    user_email = user["email"] if user else "anonymous"
    cursor     = db.progress.find({"user_email": user_email}, {"_id": 0})
    progress   = await cursor.to_list(length=200)
    return {"progress": progress}


# ─── Entry Point ─────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

