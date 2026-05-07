import getpass
from app.db.database import SessionLocal
from app.db.models import User
from app.main import hash_password

def manage_user():
    db = SessionLocal()
    try:
        print("\n=== 🔐 Admin Account Manager ===")
        current_username = input("Enter current username (e.g., admin_user or reo): ").strip()
        
        user = db.query(User).filter(User.username == current_username).first()
        if not user:
            print(f"❌ User '{current_username}' not found in the database!")
            return
            
        print(f"\n✅ User '{current_username}' found!")
        print("-" * 30)
        
        new_username = input("Enter NEW username (or press Enter to keep current): ").strip()
        new_password = getpass.getpass("Enter NEW password (or press Enter to keep current): ").strip()
        
        changes_made = False
        
        if new_username:
            user.username = new_username
            print(f"[*] Username updated to: {new_username}")
            changes_made = True
            
        if new_password:
            user.hashed_password = hash_password(new_password)
            print("[*] Password safely hashed and updated")
            changes_made = True
            
        if changes_made:
            db.commit()
            print("\n🚀 Success! All changes saved to the database.")
        else:
            print("\n⚠️ No changes were made.")
            
    finally:
        db.close()

if __name__ == "__main__":
    manage_user()
