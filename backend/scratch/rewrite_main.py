import os

base_dir = 'c:/G-Tec-Azhagiyamandapam/Company-site/backend/app'
main_path = os.path.join(base_dir, 'main.py')

new_main_content = """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from sqlalchemy import text
from app.db import models, database
from app.core.seeder import seed_all_data
from app.routers import auth, pricing, contacts, enrollments, courses, game

load_dotenv()

# Create tables in PostgreSQL
models.Base.metadata.create_all(bind=database.engine)

# Database migration to add columns if they do not exist
try:
    with database.engine.begin() as conn:
        conn.execute(text("ALTER TABLE game_scores ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0"))
        conn.execute(text('ALTER TABLE game_scores ADD COLUMN IF NOT EXISTS "correctAnswers" INTEGER DEFAULT 0'))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS school VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS school_status VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS school_year VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS college_status VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS college_degree_type VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS college_degree VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS staff_feedback VARCHAR"))
        conn.execute(text("ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR"))
        conn.execute(text("ALTER TABLE game_scores ADD COLUMN IF NOT EXISTS staff_feedback VARCHAR"))
        conn.execute(text("ALTER TABLE courses ADD COLUMN IF NOT EXISTS category_id INTEGER"))
    print("Successfully applied database migrations!")
except Exception as e:
    print(f"Error executing database migrations: {e}")

# Backfill category names for courses that only have category_id
try:
    with database.engine.begin() as conn:
        category_map = {1: "IT / Technical", 2: "Accounting", 3: "Designing", 4: "Non Technical", 5: "Civil"}
        for cat_id, cat_name in category_map.items():
            conn.execute(text(
                "UPDATE courses SET category = :name WHERE category_id = :id AND (category IS NULL OR category = '')"
            ), {"name": cat_name, "id": cat_id})
    print("Successfully backfilled course categories!")
except Exception as e:
    print(f"Error backfilling categories: {e}")

# Run seeding on startup
seed_all_data()

app = FastAPI(title="AI Game Backend")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
    "https://company-site-mu-pink.vercel.app",
    "https://g-tec-azhagiyamandapam.vercel.app",
    # Vercel preview deployment URLs (auto-generated per commit)
    "https://g-tec-azhagiyamandapam-omz50aq86-vishal-mobi-s-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Backend is running"}

# Include all modular routers
app.include_router(auth.router, tags=["auth"])
app.include_router(pricing.router, tags=["pricing"])
app.include_router(contacts.router, tags=["contacts"])
app.include_router(enrollments.router, tags=["enrollments"])
app.include_router(courses.router, tags=["courses"])
app.include_router(game.router, tags=["game"])
"""

with open(main_path, 'w', encoding='utf-8') as f:
    f.write(new_main_content)

print("Successfully replaced main.py")
