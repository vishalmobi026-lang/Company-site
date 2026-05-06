from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session
import bcrypt
import os
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer


from app.db import models, database
from app.schemas import schemas

# Create tables in PostgreSQL
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
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
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
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
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
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

    updated_pricings = []
    for p in pricings:
        db_price = db.query(models.Pricing).filter(models.Pricing.course_name == p.course_name).first()
        if db_price:
            db_price.standard_price = p.standard_price
            db_price.offer_price = p.offer_price
        else:
            db_price = models.Pricing(
                course_name=p.course_name,
                standard_price=p.standard_price,
                offer_price=p.offer_price
            )
            db.add(db_price)
        updated_pricings.append(db_price)
    
    db.commit()
    for db_price in updated_pricings:
        db.refresh(db_price)
    return updated_pricings

@app.post("/contacts", response_model=schemas.ContactMessageResponse)
def create_contact(message: schemas.ContactMessageCreate, db: Session = Depends(database.get_db)):
    new_message = models.ContactMessage(**message.dict())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@app.get("/admin/contacts", response_model=List[schemas.ContactMessageResponse])
def get_contacts(db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    return db.query(models.ContactMessage).all()

@app.delete("/admin/contacts/{id}")
def delete_contact(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"detail": "Message deleted"}

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
