from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
load_dotenv()
print("Loading environment variables from .env file...")
key = os.getenv("DATABASE_PASSWORD")
print("key : ", key)
DATABASE_URL = f"postgresql://postgres:{key}@localhost:5432/test_series_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()