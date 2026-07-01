import pyodbc

conn = pyodbc.connect(
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)
cursor = conn.cursor()

# Get all columns with their data types
cursor.execute("""
    SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'pos_invoice_lines' 
    ORDER BY ORDINAL_POSITION
""")
print("pos_invoice_lines columns:")
print(f"{'Column':<35} {'Type':<15} {'MaxLen':<8} {'Nullable'}")
print("-" * 75)
for row in cursor.fetchall():
    print(f"{row[0]:<35} {row[1]:<15} {str(row[2] or ''):<8} {row[3]}")

# Check a sample row with data
print("\n\nSample row with all fields (latest with data):")
cursor.execute("SELECT TOP 1 * FROM pos_invoice_lines WHERE catalog_item_code IS NOT NULL AND catalog_item_code != '' ORDER BY id DESC")
cols = [c[0] for c in cursor.description]
row = cursor.fetchone()
if row:
    for c, v in zip(cols, row):
        if v is not None and v != '' and v != 0:
            print(f"  {c}: {v}")
else:
    print("  No rows with catalog_item_code found")
    # Try getting any row with data
    cursor.execute("SELECT TOP 1 * FROM pos_invoice_lines WHERE item_description IS NOT NULL AND item_description != '' ORDER BY id ASC")
    row = cursor.fetchone()
    if row:
        print("\n  Oldest row with item_description:")
        for c, v in zip(cols, row):
            if v is not None and v != '' and v != 0:
                print(f"    {c}: {v}")

conn.close()
