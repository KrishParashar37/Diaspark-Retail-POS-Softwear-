import pyodbc

conn_str = (
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=DIASPARKdb;"
    "UID=retail;"
    "PWD=retail@1234;"
)

def update_password():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        cursor.execute("UPDATE Users SET passwordHash = '12345' WHERE email = 'admin@diaspark.com'")
        
        conn.commit()
        print("Password updated to 12345.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    update_password()
