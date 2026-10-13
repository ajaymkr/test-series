
import os
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from database.models import User

# password_hash = PasswordHash.recommended()

SECRET_KEY = os.environ["JWT_SECRET_KEY"]
ALGORITHM = "HS256"


def authenticate_user(
    db: Session,
    email: str,
    password: str
):
    user = db.query(User).filter(User.email == email).first()

    if user is None:
        return None

    # if not password_hash.verify(password, user.password_hash):
    #     return None

    return user


def create_access_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

    payload = {
        "sub": str(user_id),
        "exp": expires_at
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
