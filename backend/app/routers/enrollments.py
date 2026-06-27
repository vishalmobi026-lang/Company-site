from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.db import models, database
from app.schemas import schemas
from app.core.security import get_admin_user, get_staff_or_admin_user

router = APIRouter()

@router.post("/enrollments", response_model=schemas.EnrollmentResponse)
def create_enrollment(enrollment: schemas.EnrollmentCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    new_enrollment = models.Enrollment(**enrollment.model_dump())
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment

@router.get("/admin/enrollments", response_model=List[schemas.EnrollmentResponse])
def get_enrollments(db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    return db.query(models.Enrollment).all()

@router.put("/admin/enrollments/{id}", response_model=schemas.EnrollmentResponse)
def update_enrollment(id: int, enrollment: schemas.EnrollmentUpdate, db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    db_enroll = db.query(models.Enrollment).filter(models.Enrollment.id == id).first()
    if not db_enroll:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    update_data = enrollment.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_enroll, key, value)
    db.commit()
    db.refresh(db_enroll)
    return db_enroll

@router.delete("/admin/enrollments/{id}")
def delete_enrollment(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_enroll = db.query(models.Enrollment).filter(models.Enrollment.id == id).first()
    if not db_enroll:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    db.delete(db_enroll)
    db.commit()
    return {"detail": "Enrollment deleted"}
