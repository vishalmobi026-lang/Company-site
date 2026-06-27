import urllib.request
import urllib.parse
import json

base_url = "http://localhost:8000"

try:
    # 1. Login as Admin
    login_data = json.dumps({
        "username": "G-Tech",
        "password": "reo007",
        "role": "admin"
    }).encode('utf-8')
    
    req = urllib.request.Request(
        f"{base_url}/admin/login", 
        data=login_data, 
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    with urllib.request.urlopen(req) as res:
        token_data = json.loads(res.read().decode('utf-8'))
        
    token = token_data["access_token"]
    print("Login success! Token retrieved.")

    # 2. Try deleting score with ID 201
    req_delete = urllib.request.Request(
        f"{base_url}/gamescores/201",
        headers={"Authorization": f"Bearer {token}"},
        method="DELETE"
    )
    
    with urllib.request.urlopen(req_delete) as res_delete:
        print("Delete response status:", res_delete.status)
        print("Delete response body:", res_delete.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Response:", e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
