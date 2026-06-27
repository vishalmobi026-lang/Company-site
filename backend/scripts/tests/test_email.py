import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

def test_email():
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    target_email = os.getenv("EMAIL_TARGET")

    print(f"Testing with: {smtp_user} / {target_email}")
    
    msg = MIMEText("Test message from your website setup.")
    msg['Subject'] = "Test Email"
    msg['From'] = smtp_user
    msg['To'] = target_email

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.set_debuglevel(1)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print("SUCCESS: Email sent!")
    except Exception as e:
        print(f"FAILURE: {e}")

if __name__ == "__main__":
    test_email()
