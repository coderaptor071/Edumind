# backend/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn
from routes import syllabus, quiz, chat
from dotenv import load_dotenv

load_dotenv()  # load .env variables if any

app = FastAPI(title="EduMind AI")

# CORS configuration
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://mongo:27017")
client = AsyncIOMotorClient(MONGODB_URI)
db = client["edu_mind_ai"]

# Attach db to app state for use in routers
app.state.db = db

# Include API routes
app.include_router(syllabus.router, prefix="/syllabus", tags=["syllabus"])
app.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
