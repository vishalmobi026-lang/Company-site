from sqlalchemy.orm import Session
from app.db import models, database
import os
from dotenv import load_dotenv

load_dotenv()

def seed_missing_courses():
    db = next(database.get_db())
    try:
        initial_courses = [
            # Technical -> IT / Technical
            {"title": "Full-Stack Development", "description": "Build complete applications with frontend, backend, database, and deployment skills.", "image_url": "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "tag": "Popular"},
            {"title": "MERN Stack Development", "description": "Create full-stack web apps using MongoDB, Express, React, and Node.js.", "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "tag": "Web Dev"},
            {"title": "Python Developer", "description": "Learn Python programming for applications, automation, and backend development.", "image_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "tag": "Code"},
            
            # Accounting -> Accounting
            {"title": "Tally Prime", "description": "Master professional accounting and GST management with Tally Prime.", "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80", "category": "Accounting", "tag": "Career"},
            {"title": "GST Accounting", "description": "Understand GST billing, tax entries, returns, and practical filing basics.", "image_url": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80", "category": "Accounting", "tag": "Tax"},
            
            # Designing -> Designing
            {"title": "Graphic Designing", "description": "Master Photoshop, Illustrator, and CorelDRAW for professional branding.", "image_url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80", "category": "Designing", "tag": "Creative"},
            {"title": "UI/UX Design", "description": "Design user-centered interfaces and experiences with modern design tools.", "image_url": "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80", "category": "Designing", "tag": "Modern"},
            
            # NonTechnical -> Non Technical
            {"title": "Digital Marketing", "description": "Learn SEO, SEM, social media, and content marketing strategies.", "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", "category": "Non Technical", "tag": "Business"},
            {"title": "Office Management", "description": "Master MS Office tools for efficient workplace documentation and operations.", "image_url": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80", "category": "Non Technical", "tag": "Basics"},
            
            # Civil -> Civil
            {"title": "AutoCAD (Civil)", "description": "Learn 2D and 3D architectural drawing and building design planning.", "image_url": "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=800&q=80", "category": "Civil", "tag": "Core"},
            {"title": "Revit Architecture", "description": "Master Building Information Modeling (BIM) for architectural projects.", "image_url": "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=800&q=80", "category": "Civil", "tag": "BIM"}
        ]
        
        for c_data in initial_courses:
            existing = db.query(models.Course).filter(models.Course.title == c_data["title"]).first()
            if not existing:
                db.add(models.Course(**c_data))
                print(f"Added course: {c_data['title']}")
            else:
                # Update category just in case
                existing.category = c_data["category"]
                print(f"Updated category for: {c_data['title']}")
        
        db.commit()
        print("Course seeding/update complete!")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_missing_courses()
