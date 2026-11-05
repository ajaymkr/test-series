from fastapi import Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Category
from schemas.category import CategoryCreate


def list_category(db):
    users = db.query(Category).all()

    return users

def read_category(category_id, db):
    users = db.query(Category).filter(Category.id == category_id).first()

    return users

def read_category_by_user_id(user_id, db):
    users = db.query(Category).filter(Category.user_id == user_id).all()

    return users

def create_category(category , db):
    new_user = Category(
        name=category.name,
        user_id=category.user_id,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

