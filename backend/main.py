from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

from llm import generate_session_summary
from db import get_session, write_session, get_sessions_by_user, delete_session
from data_models import SessionSummary, GenerateSessionSummary


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/session_summary") #not currently in use
async def get_session_summary(request: Request):
    session_id = request.query_params.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id in request")
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@app.post("/session_summary")
async def post_session_summary(summary: SessionSummary):
    return {'id': write_session(summary.dict(), session_id=summary.id)}

@app.delete("/session_summary")
async def delete_session_summary(request: Request):
    session_id = request.query_params.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id in request")
    delete_session(session_id)
    return Response(status_code=200)

@app.get("/user_session_summaries")
async def get_user_session_summaries(request: Request):
    user = request.query_params.get("user")
    if not user:
        raise HTTPException(status_code=400, detail="Missing user in request")
    sessions = get_sessions_by_user(user)
    if sessions is None:
        raise HTTPException(status_code=404, detail="No sessions found for user")
    return {'sessions': sessions}

@app.post("/generate_session_summary")
async def post_generate_session_summary(summary: GenerateSessionSummary):
    return {'session_summary': generate_session_summary(summary.notes)}
