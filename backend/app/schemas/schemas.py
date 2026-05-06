from pydantic import BaseModel, EmailStr

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
    standard_price: str
    offer_price: str

class PricingResponse(PricingCreate):
    id: int

    class Config:
        from_attributes = True