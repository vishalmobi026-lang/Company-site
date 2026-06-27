from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL'))

with engine.connect() as conn:
    trans = conn.begin()
    try:
        print("Dropping old column...")
        conn.execute(text('ALTER TABLE pricing DROP COLUMN IF EXISTS is_featured'))
        print("Creating new Boolean column...")
        conn.execute(text('ALTER TABLE pricing ADD COLUMN is_featured BOOLEAN DEFAULT FALSE'))
        trans.commit()
        print("✅ Database Type Fixed Successfully!")
    except Exception as e:
        trans.rollback()

        print(f"❌ Error: {e}")