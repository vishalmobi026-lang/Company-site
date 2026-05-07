from sqlalchemy import Column, Integer, String
from database import Base

class AdminUser(Base):
    __tablename__ = "admin_users" # Must match your DB table name exactly

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)