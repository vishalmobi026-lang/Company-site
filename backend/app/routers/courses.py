from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import models, database
from app.schemas import schemas
from app.core.security import get_admin_user

router = APIRouter()

@router.get("/courses", response_model=list[schemas.CourseResponse])
def get_courses(category: str = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Course)
    if category:
        query = query.filter(models.Course.category == category)
    return query.order_by(models.Course.order_index.asc()).all()

@router.post("/admin/courses", response_model=schemas.CourseResponse)
def create_course(course: schemas.CourseCreate, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    new_course = models.Course(**course.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.put("/admin/courses/{id}", response_model=schemas.CourseResponse)
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

@router.put("/admin/courses/reorder")
def reorder_courses(courses: List[schemas.CourseReorder], db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    for course_data in courses:
        db.query(models.Course).filter(models.Course.id == course_data.id).update({"order_index": course_data.order_index})
    db.commit()
    return {"detail": "Courses reordered"}

@router.delete("/admin/courses/{id}")
def delete_course(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_course = db.query(models.Course).filter(models.Course.id == id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(db_course)
    db.commit()
    return {"detail": "Course deleted"}

@router.get("/categories", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(database.get_db)):
    return db.query(models.Category).all()

@router.post("/admin/categories", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    new_cat = models.Category(**category.dict())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.delete("/admin/categories/{id}")
def delete_category(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    db_cat = db.query(models.Category).filter(models.Category.id == id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"detail": "Category deleted"}
