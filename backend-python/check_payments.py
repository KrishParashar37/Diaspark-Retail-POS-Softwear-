import pyodbc

conn = pyodbc.connect(
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)
cursor = conn.cursor()

# Get the schema and latest row from pos_invoice_payments
cursor.execute("""
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'pos_invoice_payments' 
    ORDER BY ORDINAL_POSITION
""")
cols = [row[0] for row in cursor.fetchall()]

cursor.execute("SELECT TOP 2 * FROM pos_invoice_payments ORDER BY id DESC")
for i, row in enumerate(cursor.fetchall()):
    print(f"\n{'='*60}")
    print(f"PAYMENT ROW {i+1} (id={row[cols.index('id')]})")
    print(f"{'='*60}")
    for c, v in zip(cols, row):
        status = ""
        if v is None:
            status = " <-- NULL"
        elif v == '':
            status = " <-- EMPTY"
        print(f"  {c:40s} = {repr(v)}{status}")

# Try to find a good known payment
print(f"\n{'='*60}")
print("REFERENCE PAYMENT ROW (known good)")
print(f"{'='*60}")
cursor.execute("SELECT TOP 1 * FROM pos_invoice_payments WHERE payment_type_code IS NOT NULL AND payment_type_code != '' ORDER BY id DESC")
row = cursor.fetchone()
if row:
    for c, v in zip(cols, row):
        if v is not None and v != '' and v != 0 and v != ' ':
            print(f"  {c:40s} = {repr(v)}")

conn.close()
