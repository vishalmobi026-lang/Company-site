from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def migrate_categories():
    with engine.connect() as conn:
        print("Migrating course categories to match dynamic category names...")
        
        # Mapping: Old Category -> New Category Name
        mapping = {
            "Technical": "IT / Technical",
            "NonTechnical": "Non Technical",
            "Designing": "Designing",
            "Accounting": "Accounting",
            "Civil": "Civil"
        }
        
        for old, new in mapping.items():
            query = text("UPDATE courses SET category = :new WHERE category = :old")
            result = conn.execute(query, {"new": new, "old": old})
            print(f"Updated {result.rowcount} courses from '{old}' to '{new}'")
            
        conn.commit()
        print("Migration complete!")

if __name__ == "__main__":
    migrate_categories()
