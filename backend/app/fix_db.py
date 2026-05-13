import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def fix_database():
    with engine.connect() as conn:
        print("Checking for created_at column in contact_messages...")
        try:
            conn.execute(text("ALTER TABLE contact_messages ADD COLUMN created_at VARCHAR;"))
            conn.commit()
            print("Successfully added created_at column to contact_messages.")
        except Exception as e:
            if "already exists" in str(e):
                print("Column created_at already exists in contact_messages.")
            else:
                print(f"Error adding column to contact_messages: {e}")

        print("Checking for created_at column in professional_inquiries...")
        try:
            # Professional inquiries was newly created, so it might already have it, but just in case
            conn.execute(text("ALTER TABLE professional_inquiries ADD COLUMN created_at VARCHAR;"))
            conn.commit()
            print("Successfully added created_at column to professional_inquiries.")
        except Exception as e:
            if "already exists" in str(e):
                print("Column created_at already exists in professional_inquiries.")
            else:
                print(f"Error adding column to professional_inquiries: {e}")

if __name__ == "__main__":
    fix_database()
