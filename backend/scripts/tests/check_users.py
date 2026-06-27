from app.db.database import SessionLocal
from app.db.models import User

def check_admin():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Found {len(users)} users.")
        for user in users:
            print(f"Username: {user.username}, Role: {user.role}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admin()
