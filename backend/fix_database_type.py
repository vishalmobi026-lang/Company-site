from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def force_fix_database():
    """
    Nuclear fix for database type mismatch errors.
    This drops the is_featured column and recreates it as a BOOLEAN.
    Run this on any device showing a '500 Internal Server Error' or 'Datatype Mismatch'.
    """
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("🚀 Starting Database Type Repair...")
            
            print("1. Dropping old column (if it exists as an Integer)...")
            conn.execute(text('ALTER TABLE pricing DROP COLUMN IF EXISTS is_featured'))
            
            print("2. Recreating column as BOOLEAN...")
            conn.execute(text('ALTER TABLE pricing ADD COLUMN is_featured BOOLEAN DEFAULT FALSE'))
            
            trans.commit()
            print("✅ Database Type Fixed Successfully!")
            print("💡 Now go to the Management Portal and click 'Reset Defaults' to fill the data.")
            
        except Exception as e:
            trans.rollback()
            print(f"❌ Error during repair: {e}")

if __name__ == "__main__":
    force_fix_database()
