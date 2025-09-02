# backend/routes/quiz.py
import json
from fastapi import APIRouter, Form, HTTPException
from datetime import datetime
from utils import ollama

router = APIRouter()

@router.post("/generate")
async def generate_quiz(
    syllabus_id: str = Form(...),
    topic: str = Form(...),
    difficulty: str = Form(...),
    num_questions: int = Form(...),
    question_types: str = Form(...)
):
    prompt = f"""Generate a {difficulty} quiz with {num_questions} questions on {topic}. 
Include {question_types}. Return JSON in the following format:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["...", "..."],
      "correct_answer": "...",
      "explanation": "..."
    }}
  ]
}}"""
    quiz_response = await ollama.generate(prompt)
    
    try:
        quiz_json = json.loads(quiz_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to parse quiz data")
    
    # Add metadata (in a real app, user_id would be from auth)
    quiz_json["user_id"] = "example_user_id"
    quiz_json["syllabus_id"] = syllabus_id
    quiz_json["timestamp"] = datetime.utcnow().isoformat()
    
    db = router.app.state.db
    result = await db.quizzes.insert_one(quiz_json)
    quiz_json["_id"] = str(result.inserted_id)
    
    return quiz_json
