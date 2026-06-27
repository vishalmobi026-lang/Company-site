from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env file.")
    exit(1)

engine = create_engine(DATABASE_URL)

def sync_db():
    print("🚀 Starting Database Sync...")
    
    # List of tables and columns to check/add
    # Format: (table_name, column_name, sql_to_add)
    updates = [
        # Contact Messages table
        ("contact_messages", "is_deleted", "ALTER TABLE contact_messages ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE NOT NULL"),
        ("contact_messages", "feedback", "ALTER TABLE contact_messages ADD COLUMN feedback VARCHAR"),
        ("contact_messages", "professional_email", "ALTER TABLE contact_messages ADD COLUMN professional_email VARCHAR"),
        ("contact_messages", "status", "ALTER TABLE contact_messages ADD COLUMN status VARCHAR DEFAULT 'Active'"),
        ("contact_messages", "created_at", "ALTER TABLE contact_messages ADD COLUMN created_at VARCHAR"),
        
        # Enrollments table
        ("enrollments", "dob", "ALTER TABLE enrollments ADD COLUMN dob VARCHAR"),
        
        # Pricing table
        ("pricing", "is_featured", "ALTER TABLE pricing ADD COLUMN is_featured BOOLEAN DEFAULT FALSE"),
        ("pricing", "accent_color", "ALTER TABLE pricing ADD COLUMN accent_color VARCHAR DEFAULT '#2563eb'"),
        ("pricing", "border_color", "ALTER TABLE pricing ADD COLUMN border_color VARCHAR DEFAULT '#dbeafe'"),
        ("pricing", "features", "ALTER TABLE pricing ADD COLUMN features VARCHAR DEFAULT ''"),
    ]

    with engine.connect() as conn:
        for table, col, sql in updates:
            # Check if column exists
            query = text(f"""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name='{table}' AND column_name='{col}'
            """)
            result = conn.execute(query).fetchone()
            
            if not result:
                print(f"🔧 Adding missing column '{col}' to '{table}'...")
                try:
                    conn.execute(text(sql))
                    conn.commit()
                    print(f"✅ Successfully added '{col}'")
                except Exception as e:
                    print(f"❌ Error adding '{col}': {e}")
            else:
                print(f"✔ Column '{col}' in '{table}' already exists.")

        # Special check for ProfessionalInquiry table (though create_all should handle it)
        print("\nChecking if all tables exist...")
        # (This is just a safety net, create_all in main.py usually handles this)
        
    print("\n✨ Database sync complete! Please restart your backend server.")

if __name__ == "__main__":
    sync_db()
