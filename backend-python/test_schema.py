import pyodbc

conn_str = (
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

cursor.execute("""
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'pos_invoices'
""")
for row in cursor.fetchall():
    print(row)
    
cursor.execute("""
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'pos_invoice_lines'
""")
print("LINES:")
for row in cursor.fetchall():
    print(row)

cursor.execute("""
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'pos_invoice_payments'
""")
print("PAYMENTS:")
for row in cursor.fetchall():
    print(row)
