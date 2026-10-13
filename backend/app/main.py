from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Test
from schemas.schemas import TestCreate
from routers import user,test,attempt
from fastapi.middleware.cors import CORSMiddleware
# from schemas import TestResponse



app = FastAPI(
    title="Test Series API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(user.router)
app.include_router(test.router)
app.include_router(attempt.router)
@app.get("/")
def root():
    return {
        "message": "Test Series API is running"
    }


# @app.get("/health")
# def health():
#     return {
#         "status": "OK"
#     }


# @app.post("/tests")
# def create_tests(test : TestCreate, db: Session = Depends(get_db)):
#     new_test = Test(
#         title=test.title,
#         description=test.description,
#         duration_minutes=test.duration_minutes,
#         is_active=test.is_active
#     )

#     db.add(new_test)
#     db.commit()
#     db.refresh(new_test)

#     return new_test


# @app.get("/tests")
# def get_tests(db: Session = Depends(get_db)):

#     tests = db.query(Test).filter(
#         Test.is_active == True
#     ).all()

#     return tests
# @app.get("/tests/{test_id}")
# def get_test(
#     test_id: int,
#     db: Session = Depends(get_db)
# ):

#     test = db.query(Test).filter(
#         Test.id == test_id,
#         Test.is_active == True
#     ).first()

#     if not test:
#         raise HTTPException(
#             status_code=404,
#             detail="Test not found"
#         )

#     return test