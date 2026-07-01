import sqlite3
import os

db_path = 'pos.db'
if os.path.exists(db_path):
    print("Database pos.db exists.")
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Tables in pos.db:")
        for table in tables:
            print("-", table[0])
        
        cursor.execute("SELECT COUNT(*) FROM Customers")
        print("Customers count:", cursor.fetchone()[0])
        
        conn.close()
    except Exception as e:
        print("Error connecting to database:", e)
else:
    print("pos.db not found!")
