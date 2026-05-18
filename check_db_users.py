import psycopg2

try:
    conn = psycopg2.connect(
        dbname='admin',
        user='postgres',
        password='0000',
        host='localhost',
        port='5432'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, role FROM users;")
    rows = cursor.fetchall()
    print("Users in database:")
    for row in rows:
        print(f"ID: {row[0]}, Username: {row[1]}, Role: {row[2]}")
    cursor.close()
    conn.close()
except Exception as e:
    print("Error:", e)
