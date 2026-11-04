from pydantic import BaseModel
from datetime import datetime

class TestCreate(BaseModel):
    title: str
    description: str
    duration_minutes: int
    is_active: bool
    created_at: datetime
    category_id: int
    

