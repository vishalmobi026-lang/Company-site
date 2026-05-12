from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
import os

load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


from app.db import models, database
from app.schemas import schemas

# Create tables in PostgreSQL
models.Base.metadata.create_all(bind=database.engine)

# --- AUTOMATIC DATABASE SEEDING ---
def seed_all_data():
    db = next(database.get_db())
    try:
        # 1. Seed Admin User
        if not db.query(models.User).filter(models.User.username == "G-Tech").first():
            hashed_pw = hash_password("reo007")
            admin_user = models.User(username="G-Tech", hashed_password=hashed_pw, role="admin")
            db.add(admin_user)
            print("Successfully seeded Admin user: G-Tech")

        # 2. Seed Staff User
        if not db.query(models.User).filter(models.User.username == "G-TechStaff").first():
            hashed_pw = hash_password("G-tech@2026")
            staff_user = models.User(username="G-TechStaff", hashed_password=hashed_pw, role="staff")
            db.add(staff_user)
            print("Successfully seeded Staff user: G-TechStaff")

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
                # IT / Technical
                {"title": "Full-Stack Development", "description": "Build complete applications with frontend, backend, database, and deployment skills.", "image_url": "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "tag": "Popular"},
                {"title": "MERN Stack Development", "description": "Create full-stack web apps using MongoDB, Express, React, and Node.js.", "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "tag": "Web Dev"},
                {"title": "Python Developer", "description": "Learn Python programming for applications, automation, and backend development.", "image_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "tag": "Code"},
                
                # Accounting
                {"title": "Tally Prime", "description": "Master professional accounting and GST management with Tally Prime.", "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80", "category": "Accounting", "tag": "Career"},
                {"title": "GST Accounting", "description": "Understand GST billing, tax entries, returns, and practical filing basics.", "image_url": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80", "category": "Accounting", "tag": "Tax"},
                
                # Designing
                {"title": "Graphic Designing", "description": "Master Photoshop, Illustrator, and CorelDRAW for professional branding.", "image_url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80", "category": "Designing", "tag": "Creative"},
                {"title": "UI/UX Design", "description": "Design user-centered interfaces and experiences with modern design tools.", "image_url": "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80", "category": "Designing", "tag": "Modern"},
                
                # Non Technical
                {"title": "Digital Marketing", "description": "Learn SEO, SEM, social media, and content marketing strategies.", "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", "category": "Non Technical", "tag": "Business"},
                {"title": "Office Management", "description": "Master MS Office tools for efficient workplace documentation and operations.", "image_url": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80", "category": "Non Technical", "tag": "Basics"},
                
                # Civil
                {"title": "AutoCAD (Civil)", "description": "Learn 2D and 3D architectural drawing and building design planning.", "image_url": "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=800&q=80", "category": "Civil", "tag": "Core"},
                {"title": "Revit Architecture", "description": "Master Building Information Modeling (BIM) for architectural projects.", "image_url": "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=800&q=80", "category": "Civil", "tag": "BIM"}
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

# Run seeding on startup
seed_all_data()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

SECRET_KEY = os.getenv("SECRET_KEY", "4eb8d58c899c72e259e863690d54030678e760c6d525712e")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Explicitly verify expiration
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": True})
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def get_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def get_staff_or_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def send_contact_email(name, email, phone, subject, message):
    target_email = os.getenv("EMAIL_TARGET", "revaldoambrose90@gmail.com")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not smtp_user or not smtp_password or "your-email" in smtp_user or "your-app-password" in smtp_password:
        print("SMTP credentials not configured or using placeholders. Skipping email.")
        return

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = target_email
    msg['Subject'] = f"New Contact Message: {subject or 'No Subject'}"

    body = f"""
    New message from your website:
    
    Name: {name}
    Email: {email}
    Phone: {phone}
    Subject: {subject}
    
    Message:
    {message}
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")


@app.post("/admin/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pass = hash_password(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_pass, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/admin/login")
def login(user_data: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role, "id": user.id}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id, 
            "username": user.username, 
            "role": user.role
        }
    }

@app.get("/pricing", response_model=List[schemas.PricingResponse])
def get_pricing(db: Session = Depends(database.get_db)):
    return db.query(models.Pricing).all()

@app.post("/admin/pricing", response_model=List[schemas.PricingResponse])
def update_pricing(
    pricings: List[schemas.PricingCreate], 
    db: Session = Depends(database.get_db),
    admin: models.User = Depends(get_admin_user)
):
    try:
        updated_pricings = []
        for p in pricings:
            # Try to find by ID first if provided
            db_price = None
            if hasattr(p, 'id') and p.id:
                db_price = db.query(models.Pricing).filter(models.Pricing.id == p.id).first()
            
            # If not found by ID (or no ID provided), try by course_name as fallback
            if not db_price:
                db_price = db.query(models.Pricing).filter(models.Pricing.course_name == p.course_name).first()

            if db_price:
                db_price.course_name = p.course_name
                db_price.standard_price = str(p.standard_price)
                db_price.offer_price = str(p.offer_price)
                db_price.features = p.features
                db_price.is_featured = bool(p.is_featured)
                db_price.accent_color = p.accent_color
                db_price.border_color = p.border_color
            else:
                db_price = models.Pricing(
                    course_name=p.course_name,
                    standard_price=str(p.standard_price),
                    offer_price=str(p.offer_price),
                    features=p.features,
                    is_featured=bool(p.is_featured),
                    accent_color=p.accent_color,
                    border_color=p.border_color
                )
                db.add(db_price)
            updated_pricings.append(db_price)
        
        db.commit()
        for db_price in updated_pricings:
            db.refresh(db_price)
        return updated_pricings
    except Exception as e:
        db.rollback()
        print(f"Update pricing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/pricing/reset")
def reset_pricing(
    db: Session = Depends(database.get_db),
    admin: models.User = Depends(get_admin_user)
):
    try:
        # Clear existing pricing
        db.query(models.Pricing).delete()
        
        # Seed default 3
        defaults = [
            {"course_name": "Full-Stack Development", "standard_price": "35,000", "offer_price": "30,000", "features": "HTML/CSS/JS,React,NodeJS,PostgreSQL", "is_featured": True, "accent_color": "#2563eb", "border_color": "#dbeafe"},
            {"course_name": "MERN Stack Development", "standard_price": "35,000", "offer_price": "30,000", "features": "MongoDB,Express,React,NodeJS", "is_featured": False, "accent_color": "#2563eb", "border_color": "#dbeafe"},
            {"course_name": "Python Developer", "standard_price": "25,000", "offer_price": "20,000", "features": "Python Basics,Django/Flask,Data Analysis", "is_featured": False, "accent_color": "#2563eb", "border_color": "#dbeafe"}
        ]
        
        for d in defaults:
            db.add(models.Pricing(**d))
        
        db.commit()
        return {"message": "Pricing reset successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks

@app.post("/contacts", response_model=schemas.ContactMessageResponse)
def create_contact(message: schemas.ContactMessageCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    try:
        new_message = models.ContactMessage(**message.dict())
        db.add(new_message)
        db.commit()
        db.refresh(new_message)
        
        # Send email in background
        background_tasks.add_task(
            send_contact_email,
            new_message.name, 
            new_message.email, 
            new_message.phone, 
            new_message.subject, 
            new_message.message
        )
        
        return new_message
    except Exception as e:
        print(f"Error in create_contact: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/contacts", response_model=List[schemas.ContactMessageResponse])
def get_contacts(db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    return db.query(models.ContactMessage).filter(models.ContactMessage.is_deleted == False).all()

@app.get("/admin/contacts/deleted", response_model=List[schemas.ContactMessageResponse])
def get_deleted_contacts(db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    return db.query(models.ContactMessage).filter(models.ContactMessage.is_deleted == True).all()

@app.put("/admin/contacts/{id}/status")
def update_contact_status(id: int, update_data: dict, db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if "status" in update_data:
        msg.status = update_data["status"]
    if "feedback" in update_data:
        msg.feedback = update_data["feedback"]
        
    db.commit()
    db.refresh(msg)
    return msg

@app.delete("/admin/contacts/{id}")
def delete_contact(id: int, db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Soft delete
    msg.is_deleted = True
    db.commit()
    return {"detail": "Message moved to trash"}

@app.put("/admin/contacts/{id}/restore")
def restore_contact(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    msg.is_deleted = False
    db.commit()
    return {"detail": "Message restored"}

@app.delete("/admin/contacts/{id}/permanent")
def permanent_delete_contact(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(msg)
    db.commit()
    return {"detail": "Message permanently deleted"}

@app.post("/enrollments", response_model=schemas.EnrollmentResponse)
def create_enrollment(enrollment: schemas.EnrollmentCreate, db: Session = Depends(database.get_db)):
    new_enrollment = models.Enrollment(**enrollment.dict())
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment

@app.get("/admin/enrollments", response_model=List[schemas.EnrollmentResponse])
def get_enrollments(db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    return db.query(models.Enrollment).all()

@app.put("/admin/enrollments/{id}", response_model=schemas.EnrollmentResponse)
def update_enrollment(id: int, enrollment: schemas.EnrollmentUpdate, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_enroll = db.query(models.Enrollment).filter(models.Enrollment.id == id).first()
    if not db_enroll:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    update_data = enrollment.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_enroll, key, value)
    
    db.commit()
    db.refresh(db_enroll)
    return db_enroll

@app.delete("/admin/enrollments/{id}")
def delete_enrollment(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_enroll = db.query(models.Enrollment).filter(models.Enrollment.id == id).first()
    if not db_enroll:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    db.delete(db_enroll)
    db.commit()
    return {"detail": "Enrollment deleted"}

# --- COURSE MANAGEMENT ENDPOINTS ---

@app.get("/courses", response_model=List[schemas.CourseResponse])
def get_courses(category: str = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Course)
    if category:
        query = query.filter(models.Course.category == category)
    return query.all()

@app.post("/admin/courses", response_model=schemas.CourseResponse)
def create_course(course: schemas.CourseCreate, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    new_course = models.Course(**course.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@app.put("/admin/courses/{id}", response_model=schemas.CourseResponse)
def update_course(id: int, course: schemas.CourseUpdate, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_course = db.query(models.Course).filter(models.Course.id == id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    update_data = course.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_course, key, value)
    
    db.commit()
    db.refresh(db_course)
    return db_course

@app.delete("/admin/courses/{id}")
def delete_course(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_course = db.query(models.Course).filter(models.Course.id == id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(db_course)
    db.commit()
    return {"detail": "Course deleted"}

# --- CATEGORY MANAGEMENT ENDPOINTS ---

@app.get("/categories", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(database.get_db)):
    return db.query(models.Category).all()

@app.post("/admin/categories", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    new_cat = models.Category(**category.dict())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@app.delete("/admin/categories/{id}")
def delete_category(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_cat = db.query(models.Category).filter(models.Category.id == id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"detail": "Category deleted"}
