from app.db import models, database
from app.core.security import hash_password

def seed_all_data():
    db = next(database.get_db())
    try:
        # 1. Seed Admin User
        if not db.query(models.User).filter(models.User.username == "G-Tec").first():
            hashed_pw = hash_password("6091")
            admin_user = models.User(username="G-Tec", hashed_password=hashed_pw, role="admin")
            db.add(admin_user)
            print("Successfully seeded Admin user: G-Tec")

        # 2. Seed Staff User
        if not db.query(models.User).filter(models.User.username == "G-TecStaff").first():
            hashed_pw = hash_password("G-tec@2026")
            staff_user = models.User(username="G-TecStaff", hashed_password=hashed_pw, role="staff")
            db.add(staff_user)
            print("Successfully seeded Staff user: G-TecStaff")

        # 3. Seed Initial Pricing (Only if table is empty)
        if db.query(models.Pricing).count() == 0:
            initial_pricing = [
                {"course_name": "Full-Stack Development", "standard_price": "35,000", "offer_price": "30,000", "features": "HTML/CSS/JS,React,NodeJS,PostgreSQL"},
                {"course_name": "MERN Stack Development", "standard_price": "35,000", "offer_price": "30,000", "features": "MongoDB,Express,React,NodeJS"},
                {"course_name": "Python Developer", "standard_price": "25,000", "offer_price": "20,000", "features": "Python Basics,Django/Flask,Data Analysis"},
                {"course_name": "Tally Prime", "standard_price": "15,000", "offer_price": "12,000", "features": "Accounting,Inventory,GST Filing"},
                {"course_name": "GST Accounting", "standard_price": "15,000", "offer_price": "12,000", "features": "Taxation,Direct/Indirect Tax,Returns"},
                {"course_name": "Graphic Designing", "standard_price": "20,000", "offer_price": "18,000", "features": "Photoshop,Illustrator,CorelDraw"},
                {"course_name": "UI/UX Design", "standard_price": "20,000", "offer_price": "18,000", "features": "Figma,Adobe XD,Prototyping"},
                {"course_name": "Digital Marketing", "standard_price": "18,000", "offer_price": "15,000", "features": "SEO,SEM,SMM,Content Strategy"},
                {"course_name": "Office Management", "standard_price": "12,000", "offer_price": "10,000", "features": "MS Word,MS Excel,PowerPoint"},
                {"course_name": "AutoCAD (Civil)", "standard_price": "22,000", "offer_price": "20,000", "features": "2D Drafting,3D Modeling,Blueprint Reading"},
                {"course_name": "Revit Architecture", "standard_price": "25,000", "offer_price": "22,000", "features": "BIM Modeling,Structural Design,Rendering"}
            ]
            for p in initial_pricing:
                db.add(models.Pricing(**p))
            print("Successfully seeded initial Course Pricing")

        # 4. Seed Initial Courses (Only if table is empty)
        if db.query(models.Course).count() == 0:
            initial_courses = [
                {"title": "Full-Stack Development", "description": "Build complete applications with frontend, backend, database, and deployment skills.", "image_url": "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "category_id": 1, "tag": "Popular"},
                {"title": "MERN Stack Development", "description": "Create full-stack web apps using MongoDB, Express, React, and Node.js.", "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "category_id": 1, "tag": "Web Dev"},
                {"title": "Python Developer", "description": "Learn Python programming for applications, automation, and backend development.", "image_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "category_id": 1, "tag": "Code"},
                {"title": "Tally Prime", "description": "Master professional accounting and GST management with Tally Prime.", "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80", "category": "Accounting", "category_id": 2, "tag": "Career"},
                {"title": "GST Accounting", "description": "Understand GST billing, tax entries, returns, and practical filing basics.", "image_url": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80", "category": "Accounting", "category_id": 2, "tag": "Tax"},
                {"title": "Graphic Designing", "description": "Master Photoshop, Illustrator, and CorelDRAW for professional branding.", "image_url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80", "category": "Designing", "category_id": 3, "tag": "Creative"},
                {"title": "UI/UX Design", "description": "Design user-centered interfaces and experiences with modern design tools.", "image_url": "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80", "category": "Designing", "category_id": 3, "tag": "Modern"},
                {"title": "Digital Marketing", "description": "Learn SEO, SEM, social media, and content marketing strategies.", "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", "category": "Non Technical", "category_id": 4, "tag": "Business"},
                {"title": "Office Management", "description": "Master MS Office tools for efficient workplace documentation and operations.", "image_url": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80", "category": "Non Technical", "category_id": 4, "tag": "Basics"},
                {"title": "AutoCAD (Civil)", "description": "Learn 2D and 3D architectural drawing and building design planning.", "image_url": "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=800&q=80", "category": "Civil", "category_id": 5, "tag": "Core"},
                {"title": "Revit Architecture", "description": "Master Building Information Modeling (BIM) for architectural projects.", "image_url": "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=800&q=80", "category": "Civil", "category_id": 5, "tag": "BIM"}
            ]
            for c in initial_courses:
                db.add(models.Course(**c))
            print("Successfully seeded initial Courses")

        # 5. Seed Initial Categories (Only if table is empty)
        if db.query(models.Category).count() == 0:
            initial_categories = [
                {"name": "IT / Technical", "slug": "technical"},
                {"name": "Non Technical", "slug": "non-technical"},
                {"name": "Designing", "slug": "designing"},
                {"name": "Accounting", "slug": "accounting"},
                {"name": "Civil", "slug": "civil"}
            ]
            for cat in initial_categories:
                db.add(models.Category(**cat))
            print("Successfully seeded initial Categories")

        db.commit()
    except Exception as e:
        print(f"Seeding error: {e}")
        db.rollback()
    finally:
        db.close()
