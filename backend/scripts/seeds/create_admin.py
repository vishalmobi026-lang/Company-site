from database import SessionLocal
from models import Admin
from security import get_password_hash

def seed_admin():
    db = SessionLocal()
    # Check if admin already exists
    if not db.query(Admin).filter(Admin.email == "admin@company.com").first():
        hashed_pw = get_password_hash("your_secure_password_here")
        admin_user = Admin(email="admin@company.com", hashed_password=hashed_pw)
        db.add(admin_user)
        db.commit()
        print("Admin created successfully!")
    else:
        print("Admin already exists.")
    db.close()

if __name__ == "__main__":
    seed_admin()