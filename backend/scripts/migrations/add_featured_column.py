from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def add_is_featured_column():
    with engine.connect() as conn:
        print("Adding 'is_featured' column to pricing table...")
        try:
            conn.execute(text("ALTER TABLE pricing ADD COLUMN is_featured INTEGER DEFAULT 0"))
            # Set the first 3 courses as featured by default
            conn.execute(text("UPDATE pricing SET is_featured = 1 WHERE id IN (1, 2, 3)"))
            conn.commit()
            print("Successfully added 'is_featured' column and set defaults.")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("Column 'is_featured' already exists.")
            else:
                print(f"Error adding column: {e}")

if __name__ == "__main__":
    add_is_featured_column()
