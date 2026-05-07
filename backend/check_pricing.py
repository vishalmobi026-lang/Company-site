from app.db.database import SessionLocal
from app.db import models

db = SessionLocal()
try:
    pricings = db.query(models.Pricing).all()
    print(f"Found {len(pricings)} pricing records.")
    for p in pricings:
        print(f"Course: {p.course_name}, Standard: {p.standard_price}, Offer: {p.offer_price}")
finally:
    db.close()
