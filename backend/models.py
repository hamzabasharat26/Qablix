from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CheckIn(Base):
    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    mood = Column(String(50), nullable=False)
    stress_level = Column(Integer, default=5)
    inferred_from_text = Column(Boolean, default=False)
    user_input = Column(Text, default="")
    guidance_received = Column(Text, default="{}")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class HabitLog(Base):
    __tablename__ = "habitlogs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    date = Column(String(10), nullable=False)
    salah = Column(Boolean, default=False)
    quran = Column(Boolean, default=False)
    dhikr = Column(Boolean, default=False)
    reflection = Column(Boolean, default=False)
    daily_score = Column(Integer, default=0)
    daily_grade = Column(String(2), default="C")
