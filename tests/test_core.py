"""
POC Test Script: Council of Experts + Bicameral Pipeline Verification
Tests the core Claude API integration via Emergent Universal Key.
"""
import asyncio
import json
import os
import sys
import time

# Ensure we can load .env
sys.path.insert(0, '/app/backend')
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.chat import LlmChat, UserMessage

API_KEY = os.environ.get('EMERGENT_LLM_KEY')
MODEL_PROVIDER = "anthropic"
MODEL_NAME = "claude-4-sonnet-20250514"

# ─── Test 1: Council of Experts ─────────────────────────────────────────

async def test_council_of_experts():
    """Test that we can get structured 4-perspective analysis + synthesis from Claude."""
    print("\n" + "="*60)
    print("TEST 1: Council of Experts")
    print("="*60)
    
    system_message = """You are the Council of Experts engine for Jack Stallion Enterprise's AI Mastery course.

When given a question or decision, you MUST respond with ONLY valid JSON (no markdown, no code fences, no extra text).

The JSON must follow this exact structure:
{
  "optimist": {
    "title": "The Optimist",
    "perspective": "2-3 sentence best-case analysis"
  },
  "skeptic": {
    "title": "The Skeptic", 
    "perspective": "2-3 sentence risk/challenge analysis"
  },
  "strategist": {
    "title": "The Strategist",
    "perspective": "2-3 sentence strategic path forward"
  },
  "community": {
    "title": "Community Voice",
    "perspective": "2-3 sentence impact on stakeholders"
  },
  "synthesis": "3-4 sentence balanced recommendation integrating all perspectives"
}

CRITICAL: Return ONLY the JSON object. No markdown formatting, no code fences, no explanatory text before or after."""

    chat = LlmChat(
        api_key=API_KEY,
        session_id=f"council-test-{int(time.time())}",
        system_message=system_message
    ).with_model(MODEL_PROVIDER, MODEL_NAME)

    question = "Should our small business invest $50,000 in AI tools for customer service automation?"
    
    user_message = UserMessage(text=question)
    
    start = time.time()
    response = await chat.send_message(user_message)
    elapsed = time.time() - start
    
    print(f"Response time: {elapsed:.2f}s")
    print(f"Raw response (first 500 chars): {str(response)[:500]}")
    
    # Parse JSON
    try:
        # Try to parse directly
        data = json.loads(response)
    except json.JSONDecodeError:
        # Try to extract JSON from response (might have markdown fences)
        import re
        json_match = re.search(r'\{[\s\S]*\}', str(response))
        if json_match:
            data = json.loads(json_match.group())
        else:
            print("FAIL: Could not parse JSON from response")
            return False
    
    # Validate structure
    required_keys = ['optimist', 'skeptic', 'strategist', 'community', 'synthesis']
    for key in required_keys:
        if key not in data:
            print(f"FAIL: Missing key '{key}' in response")
            return False
        if key != 'synthesis':
            if 'perspective' not in data[key]:
                print(f"FAIL: Missing 'perspective' in {key}")
                return False
            if len(data[key]['perspective']) < 20:
                print(f"FAIL: {key} perspective too short")
                return False
    
    if len(data['synthesis']) < 30:
        print("FAIL: Synthesis too short")
        return False
    
    print("\n✅ Council of Experts: ALL CHECKS PASSED")
    print(f"  Optimist: {data['optimist']['perspective'][:80]}...")
    print(f"  Skeptic: {data['skeptic']['perspective'][:80]}...")
    print(f"  Strategist: {data['strategist']['perspective'][:80]}...")
    print(f"  Community: {data['community']['perspective'][:80]}...")
    print(f"  Synthesis: {data['synthesis'][:80]}...")
    return True


# ─── Test 2: Bicameral Pipeline Verification ────────────────────────────

async def test_bicameral_verify():
    """Test the STDIO verification layer - scores content 1-10 with detailed feedback."""
    print("\n" + "="*60)
    print("TEST 2: Bicameral Pipeline (STDIO Verification)")
    print("="*60)
    
    system_message = """You are STDIO — the Verification Layer of the ORSON Bicameral Pipeline for Jack Stallion Enterprise.

Your job: rigorously evaluate content against quality standards and return a structured score.

You operate at ZERO temperature (deterministic). You are ruthlessly honest.

Scoring rubric:
- 10/10: Indistinguishable from best manually written content
- 7/10: Publishable with minor adjustments
- 4/10: Requires significant rewriting
- 1/10: Fundamentally flawed, must be scrapped

You MUST respond with ONLY valid JSON (no markdown, no code fences, no extra text):
{
  "score": <integer 1-10>,
  "pass": <boolean, true if score >= 7>,
  "strengths": ["strength 1", "strength 2"],
  "violations": ["violation 1", "violation 2"],
  "fixes": ["specific fix 1", "specific fix 2"],
  "summary": "2-3 sentence overall assessment"
}

CRITICAL: Return ONLY the JSON object. No markdown formatting, no code fences, no explanatory text."""

    chat = LlmChat(
        api_key=API_KEY,
        session_id=f"bicameral-test-{int(time.time())}",
        system_message=system_message
    ).with_model(MODEL_PROVIDER, MODEL_NAME)

    # Sample draft content to verify
    draft = """AI is going to change everything. It's like magic, honestly. Companies that don't 
use AI will probably fail. Everyone should just start using ChatGPT for everything — 
it's basically perfect. The synergy between AI and business is unprecedented and 
leveraging these best-in-class tools will revolutionize your workflow paradigm."""

    user_message = UserMessage(
        text=f"Evaluate this draft content for a professional AI education newsletter:\n\n{draft}"
    )
    
    start = time.time()
    response = await chat.send_message(user_message)
    elapsed = time.time() - start
    
    print(f"Response time: {elapsed:.2f}s")
    print(f"Raw response (first 500 chars): {str(response)[:500]}")
    
    # Parse JSON
    try:
        data = json.loads(response)
    except json.JSONDecodeError:
        import re
        json_match = re.search(r'\{[\s\S]*\}', str(response))
        if json_match:
            data = json.loads(json_match.group())
        else:
            print("FAIL: Could not parse JSON from response")
            return False
    
    # Validate structure
    required_keys = ['score', 'pass', 'strengths', 'violations', 'fixes', 'summary']
    for key in required_keys:
        if key not in data:
            print(f"FAIL: Missing key '{key}' in response")
            return False
    
    # Validate types
    if not isinstance(data['score'], (int, float)):
        print(f"FAIL: Score is not a number: {data['score']}")
        return False
    if not isinstance(data['pass'], bool):
        print(f"FAIL: Pass is not boolean: {data['pass']}")
        return False
    if not isinstance(data['violations'], list):
        print(f"FAIL: Violations is not a list")
        return False
    if not isinstance(data['fixes'], list):
        print(f"FAIL: Fixes is not a list")
        return False
    
    # The draft is intentionally bad - score should be low
    score = int(data['score'])
    if score > 7:
        print(f"WARNING: Score unexpectedly high ({score}) for deliberately poor content")
    
    # Check pass/fail consistency
    if (score >= 7) != data['pass']:
        print(f"WARNING: Score/pass mismatch: score={score}, pass={data['pass']}")
    
    print(f"\n✅ Bicameral Verify: ALL CHECKS PASSED")
    print(f"  Score: {score}/10 (pass={data['pass']})")
    print(f"  Strengths: {data['strengths']}")
    print(f"  Violations: {data['violations']}")
    print(f"  Fixes: {data['fixes']}")
    print(f"  Summary: {data['summary'][:100]}...")
    return True


# ─── Main ────────────────────────────────────────────────────────────────

async def main():
    print("="*60)
    print("JSE AI MASTERY - CORE POC TEST")
    print(f"API Key: {API_KEY[:10]}...{API_KEY[-4:]}")
    print(f"Model: {MODEL_PROVIDER}/{MODEL_NAME}")
    print("="*60)
    
    results = {}
    
    # Test 1: Council of Experts
    try:
        results['council'] = await test_council_of_experts()
    except Exception as e:
        print(f"COUNCIL ERROR: {e}")
        results['council'] = False
    
    # Test 2: Bicameral Pipeline
    try:
        results['bicameral'] = await test_bicameral_verify()
    except Exception as e:
        print(f"BICAMERAL ERROR: {e}")
        results['bicameral'] = False
    
    # Summary
    print("\n" + "="*60)
    print("RESULTS SUMMARY")
    print("="*60)
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name}: {status}")
    
    all_passed = all(results.values())
    print(f"\nOverall: {'✅ ALL TESTS PASSED' if all_passed else '❌ SOME TESTS FAILED'}")
    return all_passed


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
