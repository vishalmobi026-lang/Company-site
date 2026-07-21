from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List
import urllib3
import threading
from app.db import models, database
from app.schemas import schemas
from app.core.security import get_admin_user, get_staff_or_admin_user
from gemini_engine import generate_ai_questions

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Global lock to prevent concurrent Gemini API generation
ai_generation_lock = threading.Lock()

router = APIRouter()

@router.post("/gamescores/add", response_model=schemas.GameScoreResponse)
def add_game_score(score_data: schemas.GameScoreCreate, db: Session = Depends(database.get_db)):
    new_score = models.GameScore(**score_data.dict())
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score

@router.get("/gamescores/all", response_model=List[schemas.GameScoreResponse])
def get_all_game_scores(db: Session = Depends(database.get_db)):
    return db.query(models.GameScore).all()

@router.get("/gamescores/check")
def check_phone_number(phone: str, db: Session = Depends(database.get_db)):
    exists = db.query(models.GameScore).filter(models.GameScore.phone == phone).first() is not None
    return {"exists": exists}

@router.delete("/gamescores/{id}")
def delete_game_score(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_score = db.query(models.GameScore).filter(models.GameScore.id == id).first()
    if not db_score:
        raise HTTPException(status_code=404, detail="Score record not found")
    db.delete(db_score)
    db.commit()
    return {"detail": "Game score record deleted"}

@router.put("/gamescores/{id}/feedback", response_model=schemas.GameScoreResponse)
def update_game_score_feedback(id: int, update_data: dict, db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    db_score = db.query(models.GameScore).filter(models.GameScore.id == id).first()
    if not db_score:
        raise HTTPException(status_code=404, detail="Score record not found")
    if "staff_feedback" in update_data:
        db_score.staff_feedback = update_data["staff_feedback"]
    db.commit()
    db.refresh(db_score)
    return db_score

@router.get("/api/countries")
def get_countries():
    return [
        {"id": "IN", "name": "India", "phonecode": "91"},
        {"id": "AE", "name": "UAE", "phonecode": "971"},
        {"id": "QA", "name": "Qatar", "phonecode": "974"},
        {"id": "OM", "name": "Oman", "phonecode": "968"},
        {"id": "SA", "name": "Saudi Arabia", "phonecode": "966"}
    ]

@router.get("/api/pincode/{pincode}")
def get_pincode_info(pincode: str):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(f"https://api.postalpincode.in/pincode/{pincode}", headers=headers, verify=False, timeout=10)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/generate-ai-questions")
def generate_questions_api(topic: str, db: Session = Depends(database.get_db)):
    existing = db.query(models.AIQuestion).filter(models.AIQuestion.topic == topic).count()
    if existing >= 500:
        return {"message": "Questions already exist (Limit 500 reached)"}
    
    with ai_generation_lock:
        try:
            ai_questions = generate_ai_questions(topic)
            for q in ai_questions:
                question = models.AIQuestion(
                    topic=topic,
                    question=q["question"],
                    option1=q["options"][0],
                    option2=q["options"][1],
                    option3=q["options"][2],
                    option4=q["options"][3],
                    correct=q["correct"]
                )
                db.add(question)
            db.commit()
            return {"success": True}
        except Exception as e:
            db.rollback()
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=500, content={"error": str(e), "message": "Failed to generate questions. Please try again later."})

@router.get("/questions")
def get_questions(topic: str, db: Session = Depends(database.get_db)):
    existing = db.query(models.AIQuestion).filter(models.AIQuestion.topic == topic).count()
    
    if existing >= 500:
        questions = db.query(models.AIQuestion).filter(models.AIQuestion.topic == topic).order_by(func.random()).all()
        final = []
        for q in questions:
            final.append({
                "q": q.question,
                "options": [q.option1, q.option2, q.option3, q.option4],
                "correct": q.correct
            })
        return final

    with ai_generation_lock:
        # Check again inside the lock in case another thread just generated questions
        existing_now = db.query(models.AIQuestion).filter(models.AIQuestion.topic == topic).count()
        if existing_now < 500:
            try:
                ai_questions = generate_ai_questions(topic)
                for q in ai_questions:
                    db_question = models.AIQuestion(
                        topic=topic,
                        question=q["question"],
                        option1=q["options"][0],
                        option2=q["options"][1],
                        option3=q["options"][2],
                        option4=q["options"][3],
                        correct=q["correct"]
                    )
                    db.add(db_question)
                db.commit()
            except Exception as e:
                db.rollback()
                # Fallback to just returning random questions if generation fails
                pass

    # ALWAYS return ALL available questions from the entire pool randomly shuffled for every student
    questions = db.query(models.AIQuestion).filter(models.AIQuestion.topic == topic).order_by(func.random()).all()
    final = []
    for q in questions:
        final.append({
            "q": q.question,
            "options": [q.option1, q.option2, q.option3, q.option4],
            "correct": q.correct
        })
    return final
