from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional, Union

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"

class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True

class PricingCreate(BaseModel):
    course_name: str
    standard_price: Union[str, int]
    offer_price: Union[str, int]

    @field_validator('standard_price', 'offer_price', mode='before')
    @classmethod
    def ensure_string(cls, v):
        return str(v)

class PricingResponse(PricingCreate):
    id: int

    class Config:
        from_attributes = True

class ContactMessageCreate(BaseModel):
    name: str
    phone: str
    email: str
    subject: Optional[str] = None
    message: Optional[str] = None
    status: Optional[str] = "Active"

class ContactMessageResponse(ContactMessageCreate):
    id: int

    class Config:
        from_attributes = True

class EnrollmentCreate(BaseModel):
    name: str
    email: str
    phone: str
    college: Optional[str] = None
    year: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    course: str

class EnrollmentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    college: Optional[str] = None
    year: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    course: Optional[str] = None

class EnrollmentResponse(EnrollmentCreate):
    id: int

    class Config:
        from_attributes = True