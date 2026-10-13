from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY

from .connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(String(20), nullable=False)
    created_at = Column(DateTime)
    # Test categories assigned to this user
    eligible_tests = Column(
        ARRAY(String),
        nullable=False,
        default=list,
        server_default="{}"
    )


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    duration_minutes = Column(Integer, nullable=False)
    is_active = Column(Boolean)
    created_at = Column(DateTime)


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    test_id = Column(
        Integer,
        ForeignKey("tests.id", ondelete="CASCADE"),
        nullable=False
    )
    question_text = Column(Text, nullable=False)
    marks = Column(Integer, nullable=False)


class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True)
    question_id = Column(
        Integer,
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False
    )
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean)


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    test_id = Column(
        Integer,
        ForeignKey("tests.id", ondelete="CASCADE"),
        nullable=False
    )
    score = Column(Integer, default=0)
    started_at = Column(DateTime)
    submitted_at = Column(DateTime)


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True)
    attempt_id = Column(
        Integer,
        ForeignKey("attempts.id", ondelete="CASCADE"),
        nullable=False
    )
    question_id = Column(
        Integer,
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False
    )
    option_id = Column(
        Integer,
        ForeignKey("options.id", ondelete="CASCADE"),
        nullable=False
    )