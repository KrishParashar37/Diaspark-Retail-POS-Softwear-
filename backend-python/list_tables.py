import pyodbc
conn_str = 'Driver={SQL Server Native Client 11.0};Server=DBSRV2025;Database=POSDB;UID=retail;PWD=retail@1234;'
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()
cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'")
print([r[0] for r in cursor.fetchall()])
conn.close()
