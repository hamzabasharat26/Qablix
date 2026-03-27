import os
import re
import json
import time
from datetime import date, datetime
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import desc

from google import genai

from database import engine, get_db, Base
from models import User, CheckIn, HabitLog

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Qalbix API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Pydantic Schemas ───────────────────────────────────────────────────────────

class CheckInRequest(BaseModel):
    user_id: int = 1
    mood: Optional[str] = None
    stress_level: Optional[int] = 5
    free_text: Optional[str] = None


class HabitUpdateRequest(BaseModel):
    user_id: int = 1
    salah: bool = False
    quran: bool = False
    dhikr: bool = False
    reflection: bool = False


# ─── Utilities ───────────────────────────────────────────────────────────────────

def clean_gemini_json(raw: str) -> dict:
    """Robust regex cleaning to strip markdown fences from Gemini's JSON output."""
    cleaned = re.sub(r"^```(?:json)?\s*\n?", "", raw.strip())
    cleaned = re.sub(r"\n?```\s*$", "", cleaned.strip())
    cleaned = cleaned.strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        json_match = re.search(r"\{[\s\S]*\}", cleaned)
        if json_match:
            return json.loads(json_match.group())
        raise ValueError("Failed to parse Gemini response as JSON")


def compute_grade(salah: bool, quran: bool, dhikr: bool, reflection: bool):
    score = 0
    if salah:
        score += 40
    if quran:
        score += 25
    if dhikr:
        score += 20
    if reflection:
        score += 15
    if score >= 90:
        grade = "A"
    elif score >= 70:
        grade = "B"
    else:
        grade = "C"
    return score, grade


# ─── Startup: Ensure default user ────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    db = next(get_db())
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        db.add(User(id=1, username="default_user"))
        db.commit()
    db.close()


# ─── POST /api/checkin ─ Dual-Mode Emotion Engine ───────────────────────────────

@app.post("/api/checkin")
def create_checkin(req: CheckInRequest, db: Session = Depends(get_db)):
    inferred = False
    mood = req.mood
    user_input = req.free_text or ""

    if req.free_text and req.free_text.strip():
        inferred = True
        mood_to_use = "Unknown"
    else:
        if not mood:
            raise HTTPException(status_code=400, detail="Provide either a mood or free text.")
        mood_to_use = mood

    stress_info = f"Stress Level: {req.stress_level}/10." if req.stress_level else ""

    if inferred:
        prompt = f"""You are a compassionate Islamic behavioral and emotional coach AI named Qalbix.

A user has shared the following about how they feel today:
\"{req.free_text}\"

{stress_info}

Your task:
1. First, analyze the text and infer the closest mood from this list: Calm, Stressed, Sad, Angry, Anxious, Grateful, Hopeful.
2. Provide a brief, empathetic emotional acknowledgment.
3. Provide an authentic Quran verse (English translation) relevant to the detected emotion.
4. Provide an authentic, verified Hadith that matches the emotional state.
5. Provide one practical psychological or spiritual actionable tip.

You MUST respond ONLY with valid JSON in this exact format:
{{
  "detected_mood": "Stressed",
  "emotion_analysis": "A brief, empathetic acknowledgment.",
  "quran_verse": "Authentic verse (English translation with Surah reference).",
  "hadith_text": "Authentic, verified Hadith matching the emotion.",
  "actionable_tip": "One practical psychological or spiritual step."
}}

Do not include any markdown formatting, code fences, or extra text. Return ONLY the JSON object."""
    else:
        prompt = f"""You are a compassionate Islamic behavioral and emotional coach AI named Qalbix.

A user has checked in with the following emotional state:
- Mood: {mood_to_use}
- {stress_info}

Your task:
1. Provide a brief, empathetic emotional acknowledgment of their "{mood_to_use}" state.
2. Provide an authentic Quran verse (English translation) relevant to someone feeling {mood_to_use}.
3. Provide an authentic, verified Hadith that matches the emotional state of feeling {mood_to_use}.
4. Provide one practical psychological or spiritual actionable tip.

You MUST respond ONLY with valid JSON in this exact format:
{{
  "detected_mood": "{mood_to_use}",
  "emotion_analysis": "A brief, empathetic acknowledgment.",
  "quran_verse": "Authentic verse (English translation with Surah reference).",
  "hadith_text": "Authentic, verified Hadith matching the emotion.",
  "actionable_tip": "One practical psychological or spiritual step."
}}

Do not include any markdown formatting, code fences, or extra text. Return ONLY the JSON object."""

    # ── Retry with backoff + model fallback ──
    MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"]
    guidance = None

    for model_name in MODELS:
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )
                raw_text = response.text
                guidance = clean_gemini_json(raw_text)
                print(f"[GEMINI] Success with {model_name} on attempt {attempt+1}")
                break  # Success
            except Exception as e:
                err_str = str(e)
                print(f"[GEMINI] {model_name} attempt {attempt+1} failed: {type(e).__name__}: {err_str[:200]}")
                if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                    wait = (attempt + 1) * 3  # 3s, 6s, 9s
                    print(f"[GEMINI] Rate limited. Waiting {wait}s before retry...")
                    time.sleep(wait)
                elif "leaked" in err_str.lower() or "PERMISSION_DENIED" in err_str:
                    print("[GEMINI] API key is invalid or flagged. Skipping all retries.")
                    break
                else:
                    break  # Non-retryable error, try next model
        if guidance:
            break  # Got a successful response

    if not guidance:
        print("[GEMINI] All models/retries exhausted. Using fallback.")
        guidance = {
            "detected_mood": mood_to_use if not inferred else "Calm",
            "emotion_analysis": "We could not process your request at this time. Please try again.",
            "quran_verse": "\"Verily, with hardship, there is relief.\" (Quran 94:6)",
            "hadith_text": "The Prophet (ﷺ) said: \"Wonderful is the affair of the believer, for his affairs are all good.\" (Sahih Muslim)",
            "actionable_tip": "Take a deep breath, make wudu, and pray two rak'ahs of salah to find peace."
        }

    detected_mood = guidance.get("detected_mood", mood_to_use if not inferred else "Calm")

    checkin_record = CheckIn(
        user_id=req.user_id,
        mood=detected_mood,
        stress_level=req.stress_level or 5,
        inferred_from_text=inferred,
        user_input=user_input,
        guidance_received=json.dumps(guidance),
    )
    db.add(checkin_record)
    db.commit()
    db.refresh(checkin_record)

    return {
        "id": checkin_record.id,
        "mood": detected_mood,
        "inferred": inferred,
        "guidance": guidance,
        "timestamp": checkin_record.timestamp,
    }


# ─── POST /api/habits ─ Save Habit Log ──────────────────────────────────────────

@app.post("/api/habits")
def save_habits(req: HabitUpdateRequest, db: Session = Depends(get_db)):
    today = date.today().isoformat()

    existing = db.query(HabitLog).filter(
        HabitLog.user_id == req.user_id,
        HabitLog.date == today
    ).first()

    score, grade = compute_grade(req.salah, req.quran, req.dhikr, req.reflection)

    if existing:
        existing.salah = req.salah
        existing.quran = req.quran
        existing.dhikr = req.dhikr
        existing.reflection = req.reflection
        existing.daily_score = score
        existing.daily_grade = grade
    else:
        existing = HabitLog(
            user_id=req.user_id,
            date=today,
            salah=req.salah,
            quran=req.quran,
            dhikr=req.dhikr,
            reflection=req.reflection,
            daily_score=score,
            daily_grade=grade,
        )
        db.add(existing)

    db.commit()
    db.refresh(existing)

    return {
        "id": existing.id,
        "date": existing.date,
        "salah": existing.salah,
        "quran": existing.quran,
        "dhikr": existing.dhikr,
        "reflection": existing.reflection,
        "score": score,
        "grade": grade,
    }


# ─── GET /api/dashboard/{user_id} ───────────────────────────────────────────────

@app.get("/api/dashboard/{user_id}")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    today = date.today().isoformat()

    today_log = db.query(HabitLog).filter(
        HabitLog.user_id == user_id,
        HabitLog.date == today
    ).first()

    recent_logs = (
        db.query(HabitLog)
        .filter(HabitLog.user_id == user_id)
        .order_by(desc(HabitLog.date))
        .limit(7)
        .all()
    )

    recent_checkins = (
        db.query(CheckIn)
        .filter(CheckIn.user_id == user_id)
        .order_by(desc(CheckIn.timestamp))
        .limit(5)
        .all()
    )

    # Adaptive mode: check last 3 grades
    last_three = (
        db.query(HabitLog)
        .filter(HabitLog.user_id == user_id)
        .order_by(desc(HabitLog.date))
        .limit(3)
        .all()
    )
    adaptive_mode = "normal"
    if len(last_three) >= 3 and all(log.daily_grade == "C" for log in last_three):
        adaptive_mode = "simplified"

    def serialize_log(log):
        return {
            "id": log.id,
            "date": log.date,
            "salah": log.salah,
            "quran": log.quran,
            "dhikr": log.dhikr,
            "reflection": log.reflection,
            "score": log.daily_score,
            "grade": log.daily_grade,
        }

    def serialize_checkin(c):
        return {
            "id": c.id,
            "mood": c.mood,
            "inferred": c.inferred_from_text,
            "user_input": c.user_input,
            "guidance": json.loads(c.guidance_received) if c.guidance_received else {},
            "timestamp": c.timestamp.isoformat() if c.timestamp else None,
        }

    return {
        "today": serialize_log(today_log) if today_log else None,
        "weekly_logs": [serialize_log(l) for l in recent_logs],
        "recent_checkins": [serialize_checkin(c) for c in recent_checkins],
        "adaptive_mode": adaptive_mode,
    }


# ─── DELETE /api/reset/{user_id} ────────────────────────────────────────────────

@app.delete("/api/reset/{user_id}")
def reset_user_data(user_id: int, db: Session = Depends(get_db)):
    db.query(CheckIn).filter(CheckIn.user_id == user_id).delete()
    db.query(HabitLog).filter(HabitLog.user_id == user_id).delete()
    db.commit()
    return {"message": "All data has been reset successfully.", "user_id": user_id}


# ─── GET /api/checkins/{user_id} ────────────────────────────────────────────────

@app.get("/api/checkins/{user_id}")
def get_checkins(user_id: int, db: Session = Depends(get_db)):
    checkins = (
        db.query(CheckIn)
        .filter(CheckIn.user_id == user_id)
        .order_by(desc(CheckIn.timestamp))
        .limit(20)
        .all()
    )
    return [
        {
            "id": c.id,
            "mood": c.mood,
            "inferred": c.inferred_from_text,
            "user_input": c.user_input,
            "guidance": json.loads(c.guidance_received) if c.guidance_received else {},
            "timestamp": c.timestamp.isoformat() if c.timestamp else None,
        }
        for c in checkins
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
