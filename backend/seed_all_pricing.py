from sqlalchemy.orm import Session
from app.db import models, database
import os
from dotenv import load_dotenv

load_dotenv()

def seed_all_pricing():
    db = next(database.get_db())
    try:
        # Wipe existing pricing to avoid duplicates/confusion
        db.query(models.Pricing).delete()
        
        initial_pricing = [
            {"course_name": "Full-Stack Development", "standard_price": "35,000", "offer_price": "30,000", "features": "HTML/CSS/JS,React,NodeJS,PostgreSQL"},
            {"course_name": "MERN Stack Development", "standard_price": "35,000", "offer_price": "30,000", "features": "MongoDB,Express,React,NodeJS"},
            {"title": "Python Developer", "course_name": "Python Developer", "standard_price": "25,000", "offer_price": "20,000", "features": "Python Basics,Django/Flask,Data Analysis"},
            {"course_name": "Tally Prime", "standard_price": "15,000", "offer_price": "12,000", "features": "Accounting,Inventory,GST Filing"},
            {"course_name": "GST Accounting", "standard_price": "15,000", "offer_price": "12,000", "features": "Taxation,Direct/Indirect Tax,Returns"},
            {"course_name": "Graphic Designing", "standard_price": "20,000", "offer_price": "18,000", "features": "Photoshop,Illustrator,CorelDraw"},
            {"course_name": "UI/UX Design", "standard_price": "20,000", "offer_price": "18,000", "features": "Figma,Adobe XD,Prototyping"},
            {"course_name": "Digital Marketing", "standard_price": "18,000", "offer_price": "15,000", "features": "SEO,SEM,SMM,Content Strategy"},
            {"course_name": "Office Management", "standard_price": "12,000", "offer_price": "10,000", "features": "MS Word,MS Excel,PowerPoint"},
            {"course_name": "AutoCAD (Civil)", "standard_price": "22,000", "offer_price": "20,000", "features": "2D Drafting,3D Modeling,Blueprint Reading"},
            {"course_name": "Revit Architecture", "standard_price": "25,000", "offer_price": "22,000", "features": "BIM Modeling,Structural Design,Rendering"}
        ]
        
        for p_data in initial_pricing:
            # Cleanup for keys
            data = {k: v for k, v in p_data.items() if k != "title"}
            db.add(models.Pricing(**data))
            print(f"Added pricing for: {data['course_name']}")
            
        db.commit()
        print("Pricing seeding complete!")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_all_pricing()
