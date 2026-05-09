import requests

# Get current pricing to use a real course name
res = requests.get("http://localhost:8000/pricing")
current = res.json()
if not current:
    print("No pricing found to test update.")
    exit()

# Try to update one of them
item = current[0]
payload = [
    {
        "course_name": item["course_name"],
        "standard_price": "99,999",
        "offer_price": "88,888",
        "features": "Test Feature",
        "is_featured": 1,
        "accent_color": "#ff0000",
        "border_color": "#00ff00"
    }
]

# We need an auth token
# Try to login first (using the seeded credentials from main.py)
login_res = requests.post("http://localhost:8000/admin/login", json={
    "username": "G-Tech",
    "password": "reo007"
})

if login_res.status_code == 200:
    token = login_res.json()["access_token"]
    update_res = requests.post("http://localhost:8000/admin/pricing", 
                               json=payload,
                               headers={"Authorization": f"Bearer {token}"})
    print(f"Update Status: {update_res.status_code}")
    print(f"Response: {update_res.text}")
else:
    print(f"Login failed: {login_res.text}")
