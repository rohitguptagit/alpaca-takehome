from pydantic import BaseModel

class SessionSummary(BaseModel):
    id: str | None = None
    user: str
    summary: str
    duration: int | None = None
    type: str | None = None
    patient: str
    date: str | None = None

class GenerateSessionSummary(BaseModel):
    notes: str