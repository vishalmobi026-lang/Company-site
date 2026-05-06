from app.db.database import SessionLocal
from app.db.models import Pricing

def seed_pricing():
    db = SessionLocal()
    try:
        initial_pricing = [
            {"course_name": "Full Stack", "standard_price": "14,999", "offer_price": "9,999"},
            {"course_name": "MERN Stack", "standard_price": "19,999", "offer_price": "12,999"},
            {"course_name": "Python", "standard_price": "11,999", "offer_price": "7,999"}
        ]
        
        for p in initial_pricing:
            existing = db.query(Pricing).filter(Pricing.course_name == p["course_name"]).first()
            if not existing:
                new_price = Pricing(**p)
                db.add(new_price)
                
        db.commit()
        print("Pricing seeded successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_pricing()
