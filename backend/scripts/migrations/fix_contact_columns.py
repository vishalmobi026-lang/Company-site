"""
fix_contact_columns.py
Run this on any device that shows 'Failed to load archived inquiries'.
It safely adds the missing `is_deleted` and `feedback` columns to the
contact_messages table without destroying any existing data.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env file.")
    exit(1)

engine = create_engine(DATABASE_URL)

fixes = [
    {
        "column": "is_deleted",
        "sql": "ALTER TABLE contact_messages ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE NOT NULL;"
    },
    {
        "column": "feedback",
        "sql": "ALTER TABLE contact_messages ADD COLUMN feedback VARCHAR;"
    },
]

with engine.connect() as conn:
    for fix in fixes:
        col = fix["column"]
        # Check if column already exists
        result = conn.execute(text(f"""
            SELECT column_name FROM information_schema.columns
            WHERE table_name='contact_messages' AND column_name='{col}';
        """))
        if result.fetchone():
            print(f"  [SKIP]  Column '{col}' already exists.")
        else:
            conn.execute(text(fix["sql"]))
            conn.commit()
            print(f"  [ADDED] Column '{col}' added successfully.")

print("\nDone! Restart the backend server now.")
