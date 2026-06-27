import requests

# We need a token to test the admin endpoint
login_url = "http://localhost:8000/admin/login"
login_data = {"username": "G-Tech", "password": "reo007"}

try:
    login_res = requests.post(login_url, json=login_data)
    token = login_res.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    url = "http://localhost:8000/admin/professional-contacts"
    
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Data: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
