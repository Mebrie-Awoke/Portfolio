from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=1000)

    @field_validator("question")
    @classmethod
    def question_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Please enter a question with at least 2 characters.")
        return value


class Source(BaseModel):
    section: str
    excerpt: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]
