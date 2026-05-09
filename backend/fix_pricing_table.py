from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def fix_pricing_table():
    columns_to_add = [
        ("is_featured", "BOOLEAN DEFAULT FALSE"),
        ("accent_color", "VARCHAR DEFAULT '#2563eb'"),
        ("border_color", "VARCHAR DEFAULT '#dbeafe'"),
        ("features", "VARCHAR DEFAULT ''")
    ]
    
    with engine.connect() as conn:
        print("Checking pricing table columns...")
        for col_name, col_type in columns_to_add:
            try:
                # Try to add the column
                conn.execute(text(f"ALTER TABLE pricing ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"✅ Added column: {col_name}")
            except Exception as e:
                if "already exists" in str(e).lower():
                    print(f"ℹ️ Column '{col_name}' already exists.")
                else:
                    print(f"❌ Error adding '{col_name}': {e}")
        
        print("\nFixing data types if necessary...")
        try:
            # Ensure is_featured is boolean if it was integer
            conn.execute(text("ALTER TABLE pricing ALTER COLUMN is_featured TYPE BOOLEAN USING is_featured::boolean"))
            conn.commit()
            print("✅ Verified 'is_featured' is BOOLEAN.")
        except Exception as e:
             print(f"ℹ️ Note on 'is_featured' type: {e}")

        print("\nSetting default branding for existing rows...")
        try:
            conn.execute(text("UPDATE pricing SET accent_color = '#2563eb' WHERE accent_color IS NULL"))
            conn.execute(text("UPDATE pricing SET border_color = '#dbeafe' WHERE border_color IS NULL"))
            conn.commit()
            print("✅ Set default colors for existing rows.")
        except Exception as e:
            print(f"❌ Error setting defaults: {e}")

    print("\nDatabase fix complete! Management portal should now work on this device.")

if __name__ == "__main__":
    fix_pricing_table()
