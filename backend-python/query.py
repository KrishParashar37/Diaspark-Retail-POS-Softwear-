import pyodbc

conn_str = (
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)

try:
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Labor")
    rows = cursor.fetchall()
    for row in rows:
        print(row)
except Exception as e:
    print(e)
