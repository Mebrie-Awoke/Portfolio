from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=1000)

class Source(BaseModel):
    section: str
    excerpt: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]
