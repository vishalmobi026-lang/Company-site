from app.db.database import SessionLocal
from app.db.models import ContactMessage

def test_save():
    db = SessionLocal()
    try:
        print("Attempting to save a contact message...")
        test_msg = ContactMessage(
            name="Test User",
            email="email@example.com",
            phone="1234567890",
            subject="Test Subject",
            message="This is a test message."
        )
        db.add(test_msg)
        db.commit()
        print("Contact message saved successfully!")
    except Exception as e:
        print(f"Error occurred while saving contact message: {e}")
    finally:
        db.close()
if __name__ == "__main__":
    test_save()