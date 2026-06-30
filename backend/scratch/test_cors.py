from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient

app = FastAPI()

origins = [
    "http://localhost:5173",
]

try:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=r"https://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("Middleware added successfully")
    
    client = TestClient(app)
    response = client.options("/", headers={"Origin": "https://test.vercel.app", "Access-Control-Request-Method": "GET"})
    print("Response status:", response.status_code)
    print("Response headers:", response.headers)
except Exception as e:
    print(f"Error: {e}")
