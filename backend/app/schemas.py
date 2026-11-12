import re

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


class ContactCodeRequest(BaseModel):
    email: str = Field(min_length=5, max_length=254)
    website: str = Field(default="", max_length=200)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value):
            raise ValueError("Enter a valid email address.")
        return value


class ContactMessageRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=5, max_length=254)
    subject: str = Field(min_length=2, max_length=150)
    message: str = Field(min_length=10, max_length=5000)
    code: str = Field(min_length=6, max_length=6)
    website: str = Field(default="", max_length=200)

    @field_validator("name", "subject", "message")
    @classmethod
    def fields_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value):
            raise ValueError("Enter a valid email address.")
        return value

    @field_validator("code")
    @classmethod
    def validate_code(cls, value: str) -> str:
        if not value.isdigit():
            raise ValueError("Enter the 6-digit verification code.")
        return value
