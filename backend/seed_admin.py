from app.db.database import SessionLocal
from app.db.models import User
from app.main import hash_password

def seed():
    db = SessionLocal()
    try:
        # Check if admin already exists
        if not db.query(User).filter(User.username == "G-Tech").first():
            hashed_pw = hash_password("reo007") # New admin password
            admin_user = User(
                username="G-Tech", 
                hashed_password=hashed_pw,
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()