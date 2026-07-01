import pyodbc
conn_str = "Driver={SQL Server Native Client 11.0};Server=DBSRV2025;Database=POSDB;UID=retail;PWD=retail@1234;"
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()
cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='pos_invoice_lines'")
print([row[0] for row in cursor.fetchall()])
