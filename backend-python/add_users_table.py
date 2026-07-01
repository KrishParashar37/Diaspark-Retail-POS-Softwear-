import pyodbc

conn_str = (
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)

def create_users_table():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        # Check if table exists, if not create it
        cursor.execute("""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
            BEGIN
                CREATE TABLE Users (
                    userId INT IDENTITY(1,1) PRIMARY KEY,
                    email NVARCHAR(255) UNIQUE,
                    passwordHash NVARCHAR(MAX),
                    googleId NVARCHAR(MAX),
                    fullName NVARCHAR(MAX)
                );
            END
        """)
        
        # Insert a default admin user
        cursor.execute("""
            IF NOT EXISTS (SELECT * FROM Users WHERE email='admin@diaspark.com')
            BEGIN
                INSERT INTO Users (email, passwordHash, fullName)
                VALUES ('admin@diaspark.com', 'admin123', 'Admin User');
            END
        """)
        
        conn.commit()
        print("Users table created and dummy user inserted.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    create_users_table()
