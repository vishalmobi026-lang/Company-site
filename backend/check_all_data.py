from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

def check_all():
    with engine.connect() as conn:
        tables = ['users', 'pricing', 'courses', 'categories', 'contact_messages', 'enrollments']
        for table in tables:
            try:
                res = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = res.scalar()
                print(f"Table '{table}': {count} rows")
                if count > 0:
                    # Print first row for sample
                    res_sample = conn.execute(text(f"SELECT * FROM {table} LIMIT 1"))
                    cols = res_sample.keys()
                    row = res_sample.fetchone()
                    print(f"  Sample: {dict(zip(cols, row))}")
            except Exception as e:
                print(f"Table '{table}': Error {e}")
            print("-" * 20)

if __name__ == "__main__":
    check_all()
