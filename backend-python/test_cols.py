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
AND COLUMN_NAME IN ('customer_id', 'salesperson_code', 'cashier_code', 'sales_category', 'department', 'trans_type', 'sales_status')
""")
for row in cursor.fetchall():
    print(row)
