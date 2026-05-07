from app.db.database import engine
from sqlalchemy import text

def add_columns():
    try:
        with engine.connect() as conn:
            print("Connected to database. Adding columns...")
            conn.execute(text('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS subject VARCHAR'))
            conn.execute(text('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS message VARCHAR'))
            conn.execute(text('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT \'Active\''))
            conn.commit()
            print("Columns added successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_columns()
