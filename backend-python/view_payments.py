import pyodbc
conn_str = 'Driver={SQL Server Native Client 11.0};Server=DBSRV2025;Database=POSDB;UID=retail;PWD=retail@1234;'
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()
cursor.execute("SELECT TOP 5 * FROM pos_invoice_payments")
columns = [column[0] for column in cursor.description]
print(columns)
rows = cursor.fetchall()
for r in rows: print(r)
conn.close()
