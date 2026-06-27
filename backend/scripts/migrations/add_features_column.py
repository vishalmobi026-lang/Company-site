from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def add_column():
    with engine.connect() as conn:
        print("Checking for 'features' column in 'pricing' table...")
        try:
            conn.execute(text("ALTER TABLE pricing ADD COLUMN features VARCHAR DEFAULT '';"))
            conn.commit()
            print("Successfully added 'features' column!")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("Column 'features' already exists.")
            else:
                print(f"Error adding column: {e}")

if __name__ == "__main__":
    add_column()
