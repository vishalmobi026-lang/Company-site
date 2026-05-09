from sqlalchemy import Column, Integer, String, Boolean
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")

class Pricing(Base):
    __tablename__ = "pricing"

    id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String, unique=True, index=True, nullable=False)
    standard_price = Column(String, nullable=False)
    offer_price = Column(String, nullable=False)
    features = Column(String, default="") # Comma-separated features
    is_featured = Column(Boolean, default=False)
    accent_color = Column(String, default="#3b82f6")
    border_color = Column(String, default="#e2e8f0")

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String)
    message = Column(String)
    status = Column(String, default="Active")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    college = Column(String)
    dob = Column(String)
    year = Column(String)
    address = Column(String)
    country = Column(String)
    state = Column(String)
    district = Column(String)
    pincode = Column(String)
    course = Column(String, nullable=False)

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    image_url = Column(String)
    category = Column(String, index=True) # Technical, NonTechnical, etc.
    tag = Column(String)
    is_active = Column(Integer, default=1)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
