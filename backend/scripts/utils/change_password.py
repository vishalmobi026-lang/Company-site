import sys
from app.db.database import SessionLocal
from app.db.models import User
from app.main import hash_password

def change_password(username, new_password):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            print(f"User '{username}' not found!")
            return
            
        user.hashed_password = hash_password(new_password)
        db.commit()
        print(f"Password for '{username}' updated successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python change_password.py <username> <new_password>")
        sys.exit(1)
        
    change_password(sys.argv[1], sys.argv[2])
