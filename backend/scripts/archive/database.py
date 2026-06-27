from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Make sure this URL is correct for your Postgres setup
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:0000@localhost:5432/admin"

# 2. This MUST be named 'engine' (all lowercase)
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. Session setup
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base setup
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()