import pyodbc
c=pyodbc.connect('Driver={SQL Server Native Client 11.0};Server=DBSRV2025;Database=POSDB;UID=retail;PWD=retail@1234;')
cursor=c.cursor()
cursor.execute("SELECT TOP 5 id, trans_no, trans_date FROM pos_invoices ORDER BY id DESC")
print('Invoices:', cursor.fetchall())
