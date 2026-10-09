from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from database.connection import get_db
from database.models import Test
# from schemas import TestResponse

class TestResponse(BaseModel):
    id: int
    title: str
    description: str | None
    duration_minutes: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
app = FastAPI(
    title="Test Series API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Test Series API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "OK"
    }


@app.get("/tests")
def get_tests(db: Session = Depends(get_db)):

    tests = db.query(Test).filter(
        Test.is_active == True
    ).all()

    return tests
@app.get("/tests/{test_id}", response_model=TestResponse)
def get_test(
    test_id: int,
    db: Session = Depends(get_db)
):

    test = db.query(Test).filter(
        Test.id == test_id,
        Test.is_active == True
    ).first()

    if not test:
        raise HTTPException(
            status_code=404,
            detail="Test not found"
        )

    return test