import requests

url = "http://localhost:8000/pricing"
try:
    res = requests.get(url)
    print(f"GET /pricing Status: {res.status_code}")
    print(f"Content: {res.json()[:1]}")
except Exception as e:
    print(f"Error calling /pricing: {e}")

# Try to call admin/pricing without auth to see if it even responds
url_admin = "http://localhost:8000/admin/pricing"
try:
    res = requests.post(url_admin, json=[])
    print(f"POST /admin/pricing (no auth) Status: {res.status_code}")
    print(f"Content: {res.json()}")
except Exception as e:
    print(f"Error calling /admin/pricing: {e}")
