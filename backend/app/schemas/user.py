from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password_hash: str
    role: str
    created_at: datetime
    

