import bcrypt
from sqlalchemy.orm import Session
from app.db import models, database

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def seed_staff():
    db = next(database.get_db())
    
    username = "G-TechStaff"
    password = "G-tech@2026"
    role = "staff"
    
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.username == username).first()
    if existing_user:
        print(f"User {username} already exists.")
        return

    hashed_pass = hash_password(password)
    new_user = models.User(username=username, hashed_password=hashed_pass, role=role)
    
    try:
        db.add(new_user)
        db.commit()
        print(f"Staff user '{username}' created successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error creating staff user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_staff()
