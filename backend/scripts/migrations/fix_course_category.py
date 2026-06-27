from app.db.database import engine
from sqlalchemy import text

with engine.connect() as conn:

    # remove category_id if exists
    conn.execute(text("""
        ALTER TABLE courses
        DROP COLUMN IF EXISTS category_id;
    """))

    # add category column if missing
    conn.execute(text("""
        ALTER TABLE courses
        ADD COLUMN IF NOT EXISTS category VARCHAR;
    """))

    conn.commit()

print("courses table fixed")