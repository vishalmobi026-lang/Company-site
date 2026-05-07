# Project Setup Guide

Follow these steps to set up the project on a new device.

## Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (Running on your local machine)

---

## 1. Frontend Setup (React)

1. Open a terminal in the `react` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## 2. Backend Setup (FastAPI)

1. Open a terminal in the `backend` directory.
2. Install the required Python packages:
   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv bcrypt jose[cryptography]
   ```
3. Create a `.env` file in the `backend` directory with the following content:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/admin
   SECRET_KEY=4eb8d58c899c72e259e863690d54030678e760c6d525712e
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
   *Replace `YOUR_PASSWORD` with your PostgreSQL password.*

4. **Initialize the Database**:
   Before running the server, ensure your PostgreSQL server is running and you have created a database named `admin`.

5. **Seed Initial Data**:
   Run these scripts to set up the admin user and initial pricing:
   ```bash
   python seed_admin.py
   python seed_pricing.py
   ```

6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

---

## 3. Database Management

- The tables are automatically created when the FastAPI server starts for the first time.
- If you need to reset the database entirely, you can run `python reset_db.py` (if available) or manually drop and recreate the `admin` database.

---

## 4. Troubleshooting

- **CORS Errors**: Ensure the backend `main.py` has the correct `allow_origins` set to `http://localhost:5173`.
- **422 Validation Errors**: These are usually caused by data type mismatches. Ensure you are using the latest version of the code which includes price string/number coercion.
- **Login Failures**: Verify your `DATABASE_URL` is correct and the `users` table has been seeded.
