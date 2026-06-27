import bcrypt
from app.db.database import SessionLocal
from app.db import models

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

db = SessionLocal()
try:
    user = db.query(models.User).filter(models.User.username == "G-Tech").first()
    if user:
        if verify_password("reo007", user.hashed_password):
            print("Password 'reo007' is CORRECT for user 'G-Tech'")
        else:
            print("Password 'reo007' is INCORRECT for user 'G-Tech'")
    else:
        print("User 'G-Tech' not found")
finally:
    db.close()
