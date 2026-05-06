from app.db.database import SessionLocal
from app.db.models import User
from app.main import hash_password

def seed():
    db = SessionLocal()
    try:
        # Check if admin already exists
        if not db.query(User).filter(User.username == "admin_user").first():
            hashed_pw = hash_password("admin1234") # Change this to your desired test password
            admin_user = User(
                username="admin_user", 
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