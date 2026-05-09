from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

with engine.connect() as conn:
    print("Courses in 'IT / Technical':")
    res = conn.execute(text("SELECT title FROM courses WHERE category = 'IT / Technical'"))
    for r in res:
        print(f"- {r[0]}")
    
    print("\nCourses in 'Non Technical':")
    res = conn.execute(text("SELECT title FROM courses WHERE category = 'Non Technical'"))
    for r in res:
        print(f"- {r[0]}")
