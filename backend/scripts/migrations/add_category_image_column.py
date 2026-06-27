from app.db.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("""
        ALTER TABLE categories
        ADD COLUMN IF NOT EXISTS image_url VARCHAR;
    """))
    conn.commit()

print("image_url column added successfully")