import os
import requests

def send_contact_email(name, email, phone, subject, message, professional_email=None, target_email=None):
    if not target_email:
        target_email = os.getenv("EMAIL_TARGET", "revaldoambrose90@gmail.com")

    html_body = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background-color:#ECEFF1;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ECEFF1;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.12);">

        <tr>
  <td style="padding:0;">
    <img
       src="https://g-tec-azhagiyamandapam.vercel.app/building.png"
      alt="G-TEC Contact Inquiry"
      width="600"
      style="
        display:block;
        width:100%;
        max-width:600px;
        border:0;
        margin:0;
      "
    />
  </td>
</tr>

          <!-- Accent Bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#06b6d4,#3b82f6,#8b5cf6);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;">

              <!-- Subject Badge -->
              <div style="text-align:center;margin-bottom:32px;">
                <span style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:13px;font-weight:700;padding:8px 20px;border-radius:50px;border:1px solid #bfdbfe;">
                  📌 {subject or 'General Inquiry'}
                </span>
              </div>

              <!-- Info Cards -->
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Name -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                      <tr>
                        <td style="width:44px;background:#1d4ed8;text-align:center;padding:16px 0;font-size:18px;">👤</td>
                        <td style="padding:14px 16px;">
                          <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">Full Name</div>
                          <div style="font-size:15px;font-weight:700;color:#0f172a;">{name}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                      <tr>
                        <td style="width:44px;background:#0891b2;text-align:center;padding:16px 0;font-size:18px;">✉️</td>
                        <td style="padding:14px 16px;">
                          <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">Email Address</div>
                          <a href="mailto:{email}" style="font-size:15px;font-weight:700;color:#1d4ed8;text-decoration:none;">{email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Phone -->
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                      <tr>
                        <td style="width:44px;background:#059669;text-align:center;padding:16px 0;font-size:18px;">📞</td>
                        <td style="padding:14px 16px;">
                          <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">Phone Number</div>
                          <div style="font-size:15px;font-weight:700;color:#0f172a;">{phone}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- Message Box -->
              <div style="margin-bottom:32px;">
                <div style="font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">💬 Message</div>
                <div style="background:#f0f9ff;border-left:4px solid #1d4ed8;border-radius:0 12px 12px 0;padding:20px 24px;color:#1e293b;font-size:15px;line-height:1.7;font-style:italic;">
                  "{message}"
                </div>
              </div>

              <!-- CTA Buttons -->
              <div style="text-align:center;margin-bottom:8px;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="padding-right:10px;">
                      <a href="mailto:{email}?subject=Re: {subject or 'Your Inquiry'}" style="display:inline-block;background:linear-gradient(135deg,#1e3a8a,#1d4ed8);color:#ffffff;font-size:13px;font-weight:800;padding:16px 28px;border-radius:50px;text-decoration:none;letter-spacing:0.5px;">
                        &#9993; Reply to {name}
                      </a>
                    </td>
                    <td>
                      <a href="tel:{phone}" style="display:inline-block;background:linear-gradient(135deg,#065f46,#059669);color:#ffffff;font-size:13px;font-weight:800;padding:16px 28px;border-radius:50px;text-decoration:none;letter-spacing:0.5px;">
                        &#128222; Call {name}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:28px 40px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:700;letter-spacing:0.5px;">G-Tech Azhagiyamandapam</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    resend_api_key = os.getenv("RESEND_API_KEY")
    if not resend_api_key:
        print("RESEND_API_KEY not configured. Skipping email.")
        return

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "from": "G-Tech Azhagiyamandapam <onboarding@resend.dev>",
                "to": [target_email],
                "subject": f"New Inquiry: {subject or 'No Subject'}",
                "html": html_body
            },
            timeout=10
        )
        if response.status_code in (200, 201):
            print("Email sent successfully via Resend!")
        else:
            print(f"Resend error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error sending email via Resend: {e}")

def send_enrollment_confirmation_email(name, email, course):
    resend_api_key = os.getenv("RESEND_API_KEY")
    if not resend_api_key:
        print("RESEND_API_KEY not configured. Skipping enrollment confirmation email.")
        return
    # HTML omitted for brevity as it's disabled in main.py anyway, but keeping signature
    pass
