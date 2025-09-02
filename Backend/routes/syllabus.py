# backend/routes/syllabus.py
import os, json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
from utils import ocr, ollama

router = APIRouter()

@router.post("/upload")
async def upload_syllabus(file: UploadFile = File(...), name: str = Form(...)):
    # Validate file type
    if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    contents = await file.read()
    # Save file temporarily for processing
    os.makedirs("temp", exist_ok=True)
    file_path = os.path.join("temp", file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Extract text using Tesseract OCR
    text = await ocr.extract_text(file_path)
    
    # Build structured prompt for Ollama
    prompt = f"""Analyze the following syllabus text and return a JSON structure with topics, subtopics, and key learning objectives. Prioritize hierarchical organization. Format: 
{{
  "name": "{name}",
  "topics": [
    {{
      "title": "Topic 1",
      "subtopics": ["Subtopic 1.1", "Subtopic 1.2"],
      "keywords": ["keyword1", "keyword2"]
    }}
  ]
}}
Text: {text}"""
    
    # Generate structured syllabus via Ollama
    structured_response = await ollama.generate(prompt)
    
    try:
        syllabus_json = json.loads(structured_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to parse structured syllabus")
    
    syllabus_json["uploaded_at"] = datetime.utcnow().isoformat()
    
    # Save to MongoDB (using app.state.db passed from main.py)
    db = router.app.state.db
    result = await db.syllabus.insert_one(syllabus_json)
    syllabus_json["_id"] = str(result.inserted_id)
    
    return JSONResponse(content=syllabus_json)
