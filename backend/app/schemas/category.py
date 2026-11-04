from pydantic import BaseModel
from datetime import datetime

class CategoryCreate(BaseModel):
    name: str
    user_id: int
    