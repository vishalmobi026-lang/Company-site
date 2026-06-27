from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import models, database
from app.schemas import schemas
from app.core.security import get_admin_user

router = APIRouter()

@router.get("/pricing", response_model=List[schemas.PricingResponse])
def get_pricing(db: Session = Depends(database.get_db)):
    return db.query(models.Pricing).all()

@router.post("/admin/pricing", response_model=List[schemas.PricingResponse])
def update_pricing(
    pricings: List[schemas.PricingCreate], 
    db: Session = Depends(database.get_db),
    admin: models.User = Depends(get_admin_user)
):
    try:
        updated_pricings = []
        for p in pricings:
            db_price = None
            if hasattr(p, 'id') and p.id:
                db_price = db.query(models.Pricing).filter(models.Pricing.id == p.id).first()
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

@router.post("/admin/pricing/reset")
def reset_pricing(
    db: Session = Depends(database.get_db),
    admin: models.User = Depends(get_admin_user)
):
    try:
        db.query(models.Pricing).delete()
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
