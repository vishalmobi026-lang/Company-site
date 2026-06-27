import os
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.db import models, database
from app.schemas import schemas
from app.core.security import get_admin_user, get_staff_or_admin_user
from app.core.email import send_contact_email

router = APIRouter()

@router.post("/contacts", response_model=schemas.ContactMessageResponse)
def create_contact(message: schemas.ContactMessageCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    try:
        new_message = models.ContactMessage(**message.model_dump())
        db.add(new_message)
        db.commit()
        db.refresh(new_message)
        background_tasks.add_task(
            send_contact_email,
            new_message.name, new_message.email, new_message.phone, new_message.subject, new_message.message,
            new_message.professional_email, os.getenv("EMAIL_TARGET", "revaldoambrose90@gmail.com")
        )
        if new_message.professional_email:
            background_tasks.add_task(
                send_contact_email,
                new_message.name, new_message.email, new_message.phone, new_message.subject, new_message.message,
                new_message.professional_email, new_message.professional_email
            )
        return new_message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/contacts/widget", response_model=schemas.ContactMessageResponse)
def create_contact_widget(message: schemas.ContactMessageCreate, db: Session = Depends(database.get_db)):
    try:
        new_message = models.ContactMessage(**message.model_dump())
        db.add(new_message)
        db.commit()
        db.refresh(new_message)
        return new_message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/professional-contacts", response_model=schemas.ProfessionalInquiryResponse)
def create_professional_inquiry(inquiry: schemas.ProfessionalInquiryCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    try:
        new_inquiry = models.ProfessionalInquiry(**inquiry.model_dump())
        db.add(new_inquiry)
        db.commit()
        db.refresh(new_inquiry)
        background_tasks.add_task(
            send_contact_email,
            new_inquiry.name, new_inquiry.email, new_inquiry.phone, new_inquiry.subject, new_inquiry.message,
            None, os.getenv("EMAIL_TARGET", "revaldoambrose90@gmail.com")
        )
        return new_inquiry
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/professional-contacts", response_model=List[schemas.ProfessionalInquiryResponse])
def get_professional_contacts(db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    return db.query(models.ProfessionalInquiry).filter(models.ProfessionalInquiry.is_deleted == False).all()

@router.delete("/admin/professional-contacts/{id}")
def delete_professional_contact(id: int, db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    inquiry = db.query(models.ProfessionalInquiry).filter(models.ProfessionalInquiry.id == id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry.is_deleted = True
    db.commit()
    return {"detail": "Professional inquiry deleted"}

@router.get("/admin/contacts", response_model=List[schemas.ContactMessageResponse])
def get_contacts(db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    return db.query(models.ContactMessage).filter(models.ContactMessage.is_deleted == False).all()

@router.get("/admin/contacts/deleted", response_model=List[schemas.ContactMessageResponse])
def get_deleted_contacts(db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    return db.query(models.ContactMessage).filter(models.ContactMessage.is_deleted == True).all()

@router.put("/admin/contacts/{id}/status")
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

@router.delete("/admin/contacts/{id}")
def delete_contact(id: int, db: Session = Depends(database.get_db), user: models.User = Depends(get_staff_or_admin_user)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_deleted = True
    db.commit()
    return {"detail": "Message moved to trash"}

@router.put("/admin/contacts/{id}/restore")
def restore_contact(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_deleted = False
    db.commit()
    return {"detail": "Message restored"}

@router.delete("/admin/contacts/{id}/permanent")
def permanent_delete_contact(id: int, db: Session = Depends(database.get_db), admin: models.User = Depends(get_admin_user)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"detail": "Message permanently deleted"}
