import pyodbc

conn = pyodbc.connect(
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)
cursor = conn.cursor()

# Get columns
cursor.execute("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'pos_invoices' ORDER BY ORDINAL_POSITION")
cols = [r[0] for r in cursor.fetchall()]
print("pos_invoices columns:")
for c in cols:
    print(f"  {c}")

# Get latest 10 invoices
print("\nLatest 10 invoices (by id DESC):")
cursor.execute("SELECT TOP 10 * FROM pos_invoices ORDER BY id DESC")
col_names = [c[0] for c in cursor.description]
for row in cursor.fetchall():
    d = dict(zip(col_names, row))
    print(f"  ID={d.get('id')}, customer_id={d.get('customer_id')}, trans_date={d.get('trans_date')}, net_amt={d.get('net_amt')}")

conn.close()
