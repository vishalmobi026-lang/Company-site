from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def add_dob_column():
    with engine.connect() as conn:
        print("Adding 'dob' column to enrollments table...")
        try:
            conn.execute(text("ALTER TABLE enrollments ADD COLUMN dob VARCHAR"))
            conn.commit()
            print("Successfully added 'dob' column.")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("Column 'dob' already exists.")
            else:
                print(f"Error adding column: {e}")

if __name__ == "__main__":
    add_dob_column()
