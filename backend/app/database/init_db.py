from .connection import Base, engine
from . import models

def create_db_and_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_db_and_tables()
    print("Tables created successfully!")