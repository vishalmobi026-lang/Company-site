from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
import os

load_dotenv()

from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy import text
from sqlalchemy.orm import Session
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import smtplib
from email.mime.text import MIMEText
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from gemini_engine import generate_ai_questions
from sqlalchemy.sql.expression import func
from app.db import models, database
from app.schemas import schemas

# Create tables in PostgreSQL
models.Base.metadata.create_all(bind=database.engine)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# --- AUTOMATIC DATABASE SEEDING ---
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
                # IT / Technical
                {"title": "Full-Stack Development", "description": "Build complete applications with frontend, backend, database, and deployment skills.", "image_url": "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "category_id": 1, "tag": "Popular"},
                {"title": "MERN Stack Development", "description": "Create full-stack web apps using MongoDB, Express, React, and Node.js.", "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "category_id": 1, "tag": "Web Dev"},
                {"title": "Python Developer", "description": "Learn Python programming for applications, automation, and backend development.", "image_url": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80", "category": "IT / Technical", "category_id": 1, "tag": "Code"},
                
                # Accounting
                {"title": "Tally Prime", "description": "Master professional accounting and GST management with Tally Prime.", "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80", "category": "Accounting", "category_id": 2, "tag": "Career"},
                {"title": "GST Accounting", "description": "Understand GST billing, tax entries, returns, and practical filing basics.", "image_url": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80", "category": "Accounting", "category_id": 2, "tag": "Tax"},
                
                # Designing
                {"title": "Graphic Designing", "description": "Master Photoshop, Illustrator, and CorelDRAW for professional branding.", "image_url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80", "category": "Designing", "category_id": 3, "tag": "Creative"},
                {"title": "UI/UX Design", "description": "Design user-centered interfaces and experiences with modern design tools.", "image_url": "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80", "category": "Designing", "category_id": 3, "tag": "Modern"},
                
                # Non Technical
                {"title": "Digital Marketing", "description": "Learn SEO, SEM, social media, and content marketing strategies.", "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", "category": "Non Technical", "category_id": 4, "tag": "Business"},
                {"title": "Office Management", "description": "Master MS Office tools for efficient workplace documentation and operations.", "image_url": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80", "category": "Non Technical", "category_id": 4, "tag": "Basics"},
                
                # Civil
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

# Run seeding on startup
seed_all_data()

# Database migration to add columns if they do not exist
try:
    with database.engine.begin() as conn:
        conn.execute(text("ALTER TABLE game_scores ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0"))
        conn.execute(text("ALTER TABLE game_scores ADD COLUMN IF NOT EXISTS \"correctAnswers\" INTEGER DEFAULT 0"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS school VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS school_status VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS school_year VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS college_status VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS college_degree_type VARCHAR"))
        conn.execute(text("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS college_degree VARCHAR"))
        conn.execute(text("ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR"))
        conn.execute(
            text(
                "ALTER TABLE courses ADD COLUMN IF NOT EXISTS category_id INTEGER"
            )
        )
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

app = FastAPI(
    title="AI Game Backend"
)

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

def send_contact_email(name, email, phone, subject, message, professional_email=None, target_email=None):
    if not target_email:
        target_email = os.getenv("EMAIL_TARGET", "revaldoambrose90@gmail.com")

    html_body = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#0891b2 100%);padding:44px 40px 36px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50px;padding:7px 22px;margin-bottom:14px;">
                <span style="color:#bfdbfe;font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;">G-Tech Azhagiyamandapam</span>
              </div>
              <h1 style="margin:0 0 8px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">New Contact Inquiry</h1>
              <p style="margin:0;color:#93c5fd;font-size:13px;font-weight:500;">Someone reached out via your website contact form</p>
            </td>
          </tr>

          <!-- Accent Bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#06b6d4,#3b82f6,#8b5cf6);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;">

              <!-- Subject Badge -->
              <div style="text-align:center;margin-bottom:32px;">
                <span style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:13px;font-weight:700;padding:8px 20px;border-radius:50px;border:1px solid #bfdbfe;">
                  📌 {subject or 'General Inquiry'}
                </span>
              </div>

              <!-- Info Cards -->
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Name -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                      <tr>
                        <td style="width:44px;background:#1d4ed8;text-align:center;padding:16px 0;font-size:18px;">👤</td>
                        <td style="padding:14px 16px;">
                          <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">Full Name</div>
                          <div style="font-size:15px;font-weight:700;color:#0f172a;">{name}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                      <tr>
                        <td style="width:44px;background:#0891b2;text-align:center;padding:16px 0;font-size:18px;">✉️</td>
                        <td style="padding:14px 16px;">
                          <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">Email Address</div>
                          <a href="mailto:{email}" style="font-size:15px;font-weight:700;color:#1d4ed8;text-decoration:none;">{email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Phone -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                      <tr>
                        <td style="width:44px;background:#059669;text-align:center;padding:16px 0;font-size:18px;">📞</td>
                        <td style="padding:14px 16px;">
                          <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">Phone Number</div>
                          <div style="font-size:15px;font-weight:700;color:#0f172a;">{phone}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Professional Email (if any) -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:1px solid #bfdbfe;border-radius:12px;overflow:hidden;">
                      <tr>
                        <td style="width:44px;background:#0369a1;text-align:center;padding:16px 0;font-size:18px;">💼</td>
                        <td style="padding:14px 16px;">
                          <div style="font-size:10px;font-weight:800;color:#0369a1;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">Professional Email</div>
                          <div style="font-size:15px;font-weight:700;color:#0c4a6e;">{professional_email or 'Not Provided'}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- Message Box -->
              <div style="margin-bottom:32px;">
                <div style="font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">💬 Message</div>
                <div style="background:#f0f9ff;border-left:4px solid #1d4ed8;border-radius:0 12px 12px 0;padding:20px 24px;color:#1e293b;font-size:15px;line-height:1.7;font-style:italic;">
                  "{message}"
                </div>
              </div>

              <!-- CTA Buttons -->
              <div style="text-align:center;margin-bottom:8px;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="padding-right:10px;">
                      <a href="mailto:{email}?subject=Re: {subject or 'Your Inquiry'}" style="display:inline-block;background:linear-gradient(135deg,#1e3a8a,#1d4ed8);color:#ffffff;font-size:13px;font-weight:800;padding:16px 28px;border-radius:50px;text-decoration:none;letter-spacing:0.5px;">
                        &#9993; Reply to {name}
                      </a>
                    </td>
                    <td>
                      <a href="tel:{phone}" style="display:inline-block;background:linear-gradient(135deg,#065f46,#059669);color:#ffffff;font-size:13px;font-weight:800;padding:16px 28px;border-radius:50px;text-decoration:none;letter-spacing:0.5px;">
                        &#128222; Call {name}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:28px 40px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:700;letter-spacing:0.5px;">G-Tech Azhagiyamandapam</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    resend_api_key = os.getenv("RESEND_API_KEY")
    if not resend_api_key:
        print("RESEND_API_KEY not configured. Skipping email.")
        return

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "from": "G-Tech Azhagiyamandapam <onboarding@resend.dev>",
                "to": [target_email],
                "subject": f"New Inquiry: {subject or 'No Subject'}",
                "html": html_body
            },
            timeout=10
        )
        if response.status_code in (200, 201):
            print("Email sent successfully via Resend!")
        else:
            print(f"Resend error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error sending email via Resend: {e}")


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
        
        # Send email in background to primary target
        background_tasks.add_task(
            send_contact_email,
            new_message.name, 
            new_message.email, 
            new_message.phone, 
            new_message.subject, 
            new_message.message,
            new_message.professional_email,
            os.getenv("EMAIL_TARGET", "revaldoambrose90@gmail.com")
        )

        # ALSO send to Professional Email if provided
        if new_message.professional_email:
            background_tasks.add_task(
                send_contact_email,
                new_message.name, 
                new_message.email, 
                new_message.phone, 
                new_message.subject, 
                new_message.message,
                new_message.professional_email,
                new_message.professional_email
            )
        
        return new_message
    except Exception as e:
        print(f"Error in create_contact: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/professional-contacts", response_model=schemas.ProfessionalInquiryResponse)
def create_professional_inquiry(inquiry: schemas.ProfessionalInquiryCreate, db: Session = Depends(database.get_db)):
    try:
        new_inquiry = models.ProfessionalInquiry(**inquiry.dict())
        db.add(new_inquiry)
        db.commit()
        db.refresh(new_inquiry)
        return new_inquiry
    except Exception as e:
        print(f"Error in create_professional_inquiry: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/professional-contacts", response_model=List[schemas.ProfessionalInquiryResponse])
def get_professional_contacts(db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    return db.query(models.ProfessionalInquiry).filter(models.ProfessionalInquiry.is_deleted == False).all()

@app.delete("/admin/professional-contacts/{id}")
def delete_professional_contact(id: int, db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    inquiry = db.query(models.ProfessionalInquiry).filter(models.ProfessionalInquiry.id == id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry.is_deleted = True
    db.commit()
    return {"detail": "Professional inquiry deleted"}

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
@app.get("/courses", response_model=list[schemas.CourseResponse])
def get_courses(
    category: str = None,
    db: Session = Depends(database.get_db)
):
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

# --- GAME SCORES ENDPOINTS ---

@app.post("/gamescores/add", response_model=schemas.GameScoreResponse)
def add_game_score(score_data: schemas.GameScoreCreate, db: Session = Depends(database.get_db)):
    new_score = models.GameScore(**score_data.dict())
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score

@app.get("/gamescores/all", response_model=List[schemas.GameScoreResponse])
def get_all_game_scores(db: Session = Depends(database.get_db)):
    return db.query(models.GameScore).all()

@app.get("/gamescores/check")
def check_phone_number(phone: str, db: Session = Depends(database.get_db)):
    exists = db.query(models.GameScore).filter(models.GameScore.phone == phone).first() is not None
    return {"exists": exists}

@app.delete("/gamescores/{id}")
def delete_game_score(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_score = db.query(models.GameScore).filter(models.GameScore.id == id).first()
    if not db_score:
        raise HTTPException(status_code=404, detail="Score record not found")
    db.delete(db_score)
    db.commit()
    return {"detail": "Game score record deleted"}


@app.get("/api/countries")
def get_countries():
    # Mock data for the frontend to work
    return [
        {"id": "IN", "name": "India", "phonecode": "91"},
        {"id": "AE", "name": "UAE", "phonecode": "971"},
        {"id": "QA", "name": "Qatar", "phonecode": "974"},
        {"id": "OM", "name": "Oman", "phonecode": "968"},
        {"id": "SA", "name": "Saudi Arabia", "phonecode": "966"}
    ]



import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

@app.get("/api/pincode/{pincode}")
def get_pincode_info(pincode: str):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(f"https://api.postalpincode.in/pincode/{pincode}", headers=headers, verify=False, timeout=10)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/generate-ai-questions")
def generate_questions_api(topic: str, db: Session = Depends(database.get_db)):

    existing = (
        db.query(models.AIQuestion)
        .filter(models.AIQuestion.topic == topic)
        .count()
    )

    if existing > 50:

        return {
            "message": "Questions already exist"
        }

    try:
        ai_questions = generate_ai_questions(topic)
    except Exception as e:
        print(f"Error generating AI questions: {e}")
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"error": str(e), "message": "Failed to generate questions. Please try again later."})

    for q in ai_questions:

        question = models.AIQuestion(
            topic=topic,

            question=q["question"],

            option1=q["options"][0],
            option2=q["options"][1],
            option3=q["options"][2],
            option4=q["options"][3],

            correct=q["correct"]
        )

        db.add(question)

    db.commit()

    return {
        "success": True
    }


@app.get("/questions")

def get_questions(topic: str, db: Session = Depends(database.get_db)):

    questions = (
        db.query(models.AIQuestion)
        .filter(models.AIQuestion.topic == topic)
        .order_by(func.random())
        .limit(10)
        .all()
    )

    final = []

    for q in questions:

        final.append({
            "q": q.question,

            "options": [
                q.option1,
                q.option2,
                q.option3,
                q.option4
            ],

            "correct": q.correct
        })

    return final