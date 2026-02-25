from fastapi import FastAPI, APIRouter, BackgroundTasks, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email configuration
EMAIL_USER = os.environ.get('EMAIL_USER', '')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', '')
SPA_OWNER_EMAIL = os.environ.get('SPA_OWNER_EMAIL', '')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    subject: str
    message: str

class BookingForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    date: str
    time: str
    therapist: Optional[str] = ""
    notes: Optional[str] = ""

class EmailResponse(BaseModel):
    success: bool
    message: str

# Email Templates
def get_owner_contact_email_html(data: ContactForm) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Contact Inquiry - Amani Temptress Spa</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #0f0505;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0505; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #1a0b0b 0%, #0f0505 100%); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px;">
                        <tr>
                            <td style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                                <h1 style="color: #d4af37; font-size: 28px; margin: 0; font-weight: normal;">New Contact Inquiry</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px;">
                                <table width="100%" cellpadding="10" cellspacing="0">
                                    <tr>
                                        <td style="color: #d4af37; width: 120px; vertical-align: top;">Name:</td>
                                        <td style="color: #fce4ec;">{data.name}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Email:</td>
                                        <td style="color: #fce4ec;"><a href="mailto:{data.email}" style="color: #f3e5ab;">{data.email}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Phone:</td>
                                        <td style="color: #fce4ec;"><a href="tel:{data.phone}" style="color: #f3e5ab;">{data.phone}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Subject:</td>
                                        <td style="color: #fce4ec;">{data.subject}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Message:</td>
                                        <td style="color: #fce4ec; line-height: 1.6;">{data.message}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
                                <p style="color: #8d6e75; font-size: 14px; margin: 0;">Amani Temptress Spa — Kilimani, Nairobi</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

def get_client_contact_confirmation_html(name: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Thank You - Amani Temptress Spa</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #0f0505;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0505; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #1a0b0b 0%, #0f0505 100%); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px;">
                        <tr>
                            <td style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                                <img src="https://ik.imagekit.io/8ax0u09f2/amani%20logo.png" alt="Amani Temptress Spa" style="max-width: 150px; margin-bottom: 20px;">
                                <h1 style="color: #d4af37; font-size: 32px; margin: 0; font-weight: normal;">Thank You, {name}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px; text-align: center;">
                                <p style="color: #fce4ec; font-size: 18px; line-height: 1.8; margin: 0 0 20px;">
                                    Your message has been received. We will get back to you shortly.
                                </p>
                                <p style="color: #dbbac2; font-size: 16px; line-height: 1.6; margin: 0; font-style: italic;">
                                    "Where Desire Meets Indulgence"
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
                                <p style="color: #d4af37; font-size: 14px; margin: 0 0 10px;">Contact Us</p>
                                <p style="color: #fce4ec; font-size: 14px; margin: 0;">
                                    <a href="tel:+254710574902" style="color: #f3e5ab;">+254 710 574 902</a> |
                                    <a href="mailto:amanitemptressspa@gmail.com" style="color: #f3e5ab;">amanitemptressspa@gmail.com</a>
                                </p>
                                <p style="color: #8d6e75; font-size: 12px; margin: 20px 0 0;">Kilimani, Nairobi — Kenya</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

def get_owner_booking_email_html(data: BookingForm) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Booking Request - Amani Temptress Spa</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #0f0505;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0505; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #1a0b0b 0%, #0f0505 100%); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px;">
                        <tr>
                            <td style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                                <h1 style="color: #d4af37; font-size: 28px; margin: 0; font-weight: normal;">🌹 New Booking Request</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px;">
                                <table width="100%" cellpadding="10" cellspacing="0">
                                    <tr>
                                        <td style="color: #d4af37; width: 120px; vertical-align: top;">Client:</td>
                                        <td style="color: #fce4ec;">{data.name}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Email:</td>
                                        <td style="color: #fce4ec;"><a href="mailto:{data.email}" style="color: #f3e5ab;">{data.email}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Phone:</td>
                                        <td style="color: #fce4ec;"><a href="tel:{data.phone}" style="color: #f3e5ab;">{data.phone}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Service:</td>
                                        <td style="color: #f3e5ab; font-weight: bold;">{data.service}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Date:</td>
                                        <td style="color: #fce4ec;">{data.date}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Time:</td>
                                        <td style="color: #fce4ec;">{data.time}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Therapist:</td>
                                        <td style="color: #fce4ec;">{data.therapist or 'No preference'}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37; vertical-align: top;">Notes:</td>
                                        <td style="color: #fce4ec; line-height: 1.6;">{data.notes or 'None'}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
                                <p style="color: #8d6e75; font-size: 14px; margin: 0;">Amani Temptress Spa — Kilimani, Nairobi</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

def get_client_booking_confirmation_html(data: BookingForm) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Booking Confirmation - Amani Temptress Spa</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #0f0505;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0505; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #1a0b0b 0%, #0f0505 100%); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px;">
                        <tr>
                            <td style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                                <img src="https://ik.imagekit.io/8ax0u09f2/amani%20logo.png" alt="Amani Temptress Spa" style="max-width: 150px; margin-bottom: 20px;">
                                <h1 style="color: #d4af37; font-size: 28px; margin: 0; font-weight: normal;">Booking Request Received</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px; text-align: center;">
                                <p style="color: #fce4ec; font-size: 18px; line-height: 1.8; margin: 0 0 30px;">
                                    Dear {data.name}, your booking request has been received. We will confirm shortly.
                                </p>
                                <table width="100%" cellpadding="15" cellspacing="0" style="background: rgba(112, 8, 24, 0.3); border-radius: 8px; text-align: left;">
                                    <tr>
                                        <td style="color: #d4af37; width: 100px;">Service:</td>
                                        <td style="color: #f3e5ab; font-weight: bold;">{data.service}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37;">Date:</td>
                                        <td style="color: #fce4ec;">{data.date}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #d4af37;">Time:</td>
                                        <td style="color: #fce4ec;">{data.time}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
                                <p style="color: #dbbac2; font-style: italic; margin: 0 0 20px;">"Where Desire Meets Indulgence"</p>
                                <p style="color: #d4af37; font-size: 14px; margin: 0 0 10px;">Questions? Contact Us</p>
                                <p style="color: #fce4ec; font-size: 14px; margin: 0;">
                                    <a href="tel:+254710574902" style="color: #f3e5ab;">+254 710 574 902</a> |
                                    <a href="https://wa.me/254710574902" style="color: #f3e5ab;">WhatsApp</a>
                                </p>
                                <p style="color: #8d6e75; font-size: 12px; margin: 20px 0 0;">Kilimani, Nairobi — Kenya</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

# Email sending function
def send_email(to_email: str, subject: str, html_body: str) -> bool:
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"Amani Temptress Spa <{EMAIL_USER}>"
        message["To"] = to_email
        
        html_part = MIMEText(html_body, "html")
        message.attach(html_part)
        
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_USER, to_email, message.as_string())
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

# Background tasks
def send_contact_emails_task(data: ContactForm):
    # Send to spa owner
    send_email(
        SPA_OWNER_EMAIL,
        f"New Contact Inquiry: {data.subject}",
        get_owner_contact_email_html(data)
    )
    # Send confirmation to client
    send_email(
        data.email,
        "Thank You for Contacting Amani Temptress Spa",
        get_client_contact_confirmation_html(data.name)
    )

def send_booking_emails_task(data: BookingForm):
    # Send to spa owner
    send_email(
        SPA_OWNER_EMAIL,
        f"New Booking Request: {data.service} - {data.name}",
        get_owner_booking_email_html(data)
    )
    # Send confirmation to client
    send_email(
        data.email,
        "Booking Request Received - Amani Temptress Spa",
        get_client_booking_confirmation_html(data)
    )

# Routes
@api_router.get("/")
async def root():
    return {"message": "Amani Temptress Spa API"}

@api_router.post("/contact", response_model=EmailResponse)
async def submit_contact(data: ContactForm, background_tasks: BackgroundTasks):
    try:
        # Store in database
        contact_doc = {
            "id": str(uuid.uuid4()),
            "name": data.name,
            "email": data.email,
            "phone": data.phone,
            "subject": data.subject,
            "message": data.message,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.contacts.insert_one(contact_doc)
        
        # Send emails in background
        background_tasks.add_task(send_contact_emails_task, data)
        
        return EmailResponse(success=True, message="Your message has been sent successfully!")
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send message")

@api_router.post("/booking", response_model=EmailResponse)
async def submit_booking(data: BookingForm, background_tasks: BackgroundTasks):
    try:
        # Store in database
        booking_doc = {
            "id": str(uuid.uuid4()),
            "name": data.name,
            "email": data.email,
            "phone": data.phone,
            "service": data.service,
            "date": data.date,
            "time": data.time,
            "therapist": data.therapist,
            "notes": data.notes,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.bookings.insert_one(booking_doc)
        
        # Send emails in background
        background_tasks.add_task(send_booking_emails_task, data)
        
        return EmailResponse(success=True, message="Your booking request has been received!")
    except Exception as e:
        logger.error(f"Booking form error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit booking")

@api_router.get("/services")
async def get_services():
    services = [
        {
            "id": "swedish",
            "name": "Swedish Massage",
            "tagline": "Gentle strokes, deep relaxation",
            "description": "Our signature Swedish massage combines long, flowing strokes with gentle kneading to release tension and promote total relaxation. Perfect for those seeking a classic spa experience.",
            "benefits": ["Reduces stress & anxiety", "Improves circulation", "Relieves muscle tension", "Promotes deep relaxation"],
            "duration": "60 / 90 min",
            "price": "From KES 5,000",
            "image": "https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": "deep-tissue",
            "name": "Deep Tissue Massage",
            "tagline": "Intense relief for chronic tension",
            "description": "Targeting the deeper layers of muscle tissue, this therapeutic massage uses firm pressure and slow strokes to release chronic patterns of tension and restore mobility.",
            "benefits": ["Releases chronic muscle tension", "Breaks up scar tissue", "Improves posture", "Reduces inflammation"],
            "duration": "60 / 90 min",
            "price": "From KES 6,000",
            "image": "https://images.pexels.com/photos/5793699/pexels-photo-5793699.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": "thai",
            "name": "Thai Massage",
            "tagline": "Ancient healing art",
            "description": "An ancient healing system combining acupressure, Indian Ayurvedic principles, and assisted yoga postures. Experience the art of passive stretching and gentle pressure along energy lines.",
            "benefits": ["Increases flexibility", "Boosts energy levels", "Improves range of motion", "Balances energy flow"],
            "duration": "90 / 120 min",
            "price": "From KES 7,000",
            "image": "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": "sensual",
            "name": "Sensual Massage",
            "tagline": "Awaken your senses",
            "description": "A tantalizing journey designed to awaken every nerve ending. Our skilled therapists use a combination of feather-light touches and warm oil to create an unforgettable sensory experience.",
            "benefits": ["Heightens body awareness", "Releases emotional tension", "Promotes intimacy", "Creates deep relaxation"],
            "duration": "60 / 90 min",
            "price": "From KES 8,000",
            "image": "https://images.pexels.com/photos/6187255/pexels-photo-6187255.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": "exotic",
            "name": "Exotic Bodywork",
            "tagline": "Beyond ordinary boundaries",
            "description": "An exclusive experience that transcends traditional massage. Our exotic bodywork combines elements from various Eastern traditions with modern techniques for an extraordinary journey.",
            "benefits": ["Full body rejuvenation", "Mind-body connection", "Stress elimination", "Sensory awakening"],
            "duration": "90 / 120 min",
            "price": "From KES 10,000",
            "image": "https://images.pexels.com/photos/3865792/pexels-photo-3865792.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": "body-to-body",
            "name": "Body to Body",
            "tagline": "Ultimate connection",
            "description": "An intimate and luxurious experience where our therapist uses their entire body to massage yours. Warm oils and synchronized movements create an unparalleled sensation of closeness.",
            "benefits": ["Complete muscle relaxation", "Enhanced sensory experience", "Deep emotional release", "Ultimate stress relief"],
            "duration": "60 / 90 min",
            "price": "From KES 12,000",
            "image": "https://images.pexels.com/photos/6663366/pexels-photo-6663366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": "four-hands",
            "name": "Four Hands Massage",
            "tagline": "Double the indulgence",
            "description": "Two therapists work in perfect synchronization to deliver double the pleasure. This choreographed experience overwhelms the senses as four hands glide across your body in harmony.",
            "benefits": ["Doubles the relaxation", "Overwhelms the mind", "Synchronized bliss", "Ultimate luxury"],
            "duration": "60 / 90 min",
            "price": "From KES 15,000",
            "image": "https://images.pexels.com/photos/5793696/pexels-photo-5793696.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": "back-massage",
            "name": "Back Massage",
            "tagline": "Focused relief",
            "description": "Perfect for those short on time but in need of relief. This targeted treatment focuses entirely on the back, shoulders, and neck - where most people carry their tension.",
            "benefits": ["Quick tension relief", "Improves posture", "Reduces back pain", "Perfect for busy schedules"],
            "duration": "30 / 45 min",
            "price": "From KES 3,500",
            "image": "https://images.pexels.com/photos/3997983/pexels-photo-3997983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        }
    ]
    return services

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
