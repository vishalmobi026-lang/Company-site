import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load the .env file
load_dotenv()

# Get the URL from the environment variable
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine with a pre-ping check and longer timeouts for Neon DB sleep
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True,
    pool_recycle=300,
    pool_timeout=30,
    connect_args={"connect_timeout": 15}
)

# Session and Base setup
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to be used in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()