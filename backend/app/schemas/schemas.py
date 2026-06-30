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
    id: Optional[int] = None
    course_name: str
    standard_price: Union[str, int]
    offer_price: Union[str, int]
    features: Optional[str] = ""
    is_featured: Optional[bool] = False
    accent_color: Optional[str] = "#3b82f6"
    border_color: Optional[str] = "#e2e8f0"
    is_disabled: Optional[bool] = False

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
    feedback: Optional[str] = None
    professional_email: Optional[str] = None
    is_deleted: Optional[bool] = False

class ContactMessageResponse(ContactMessageCreate):
    id: int

    class Config:
        from_attributes = True

class ProfessionalInquiryCreate(BaseModel):
    name: str
    phone: str
    email: str
    subject: Optional[str] = None
    message: Optional[str] = None
    status: Optional[str] = "Active"
    professional_email: Optional[str] = None
    is_deleted: Optional[bool] = False
    created_at: Optional[str] = None

class ProfessionalInquiryResponse(ProfessionalInquiryCreate):
    id: int

    class Config:
        from_attributes = True

class EnrollmentCreate(BaseModel):
    name: str
    email: str
    phone: str
    college: Optional[str] = None
    dob: Optional[str] = None
    year: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    course: str
    school: Optional[str] = None
    school_status: Optional[str] = None
    school_year: Optional[str] = None
    college_status: Optional[str] = None
    college_degree_type: Optional[str] = None
    college_degree: Optional[str] = None
    id_proof: Optional[str] = None
    staff_feedback: Optional[str] = None

class EnrollmentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    college: Optional[str] = None
    dob: Optional[str] = None
    year: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    course: Optional[str] = None
    school: Optional[str] = None
    school_status: Optional[str] = None
    school_year: Optional[str] = None
    college_status: Optional[str] = None
    college_degree_type: Optional[str] = None
    college_degree: Optional[str] = None
    id_proof: Optional[str] = None
    staff_feedback: Optional[str] = None

class EnrollmentResponse(EnrollmentCreate):
    id: int

    class Config:
        from_attributes = True

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    category_id: Optional[int] = None
    tag: Optional[str] = None
    is_active: Optional[int] = 1
    order_index: Optional[int] = 0

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    category_id: Optional[int] = None
    tag: Optional[str] = None
    is_active: Optional[int] = None
    order_index: Optional[int] = None

class CourseReorder(BaseModel):
    id: int
    order_index: int

class CategoryCreate(BaseModel):
    name: str
    slug: str
    image_url: Optional[str] = None


class CategoryResponse(CategoryCreate):
    id: int

    class Config:
        from_attributes = True
class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    category_id: Optional[int] = None
    tag: Optional[str] = None
    is_active: Optional[int] = 1
    order_index: Optional[int] = 0

    class Config:
        from_attributes = True

class GameScoreCreate(BaseModel):
    name: str
    phone: str
    course: str
    score: int
    couponCode: str
    discount: Optional[int] = 0
    correctAnswers: Optional[int] = 0
    staff_feedback: Optional[str] = None

class GameScoreResponse(GameScoreCreate):
    id: int
    created_at: str

    class Config:
        from_attributes = True