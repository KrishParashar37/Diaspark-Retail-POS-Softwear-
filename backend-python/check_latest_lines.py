import pyodbc

conn = pyodbc.connect(
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)
cursor = conn.cursor()

# Check last 3 invoice lines
cursor.execute("SELECT TOP 3 * FROM pos_invoice_lines ORDER BY id DESC")
cols = [c[0] for c in cursor.description]

for i, row in enumerate(cursor.fetchall()):
    print(f"\n{'='*60}")
    print(f"ROW {i+1} (id={row[cols.index('id')]})")
    print(f"{'='*60}")
    for c, v in zip(cols, row):
        status = ""
        if v is None:
            status = " <-- NULL"
        elif v == '':
            status = " <-- EMPTY"
        elif v == 0 or v == 0.0:
            status = " <-- ZERO"
        print(f"  {c:40s} = {repr(v)}{status}")

# Also check the good reference row
print(f"\n{'='*60}")
print("REFERENCE ROW (known good - id=11702)")
print(f"{'='*60}")
cursor.execute("SELECT trans_bk, account_period_code, item_type, catalog_item_code, trans_no, customer_sku_no, item_name, item_description, serial_no, item_price, item_qty, care_plan, care_plan_item, line_trans_type, location_code, parent_item_code FROM pos_invoice_lines WHERE id = 11702")
row = cursor.fetchone()
if row:
    ref_cols = ['trans_bk', 'account_period_code', 'item_type', 'catalog_item_code', 'trans_no', 'customer_sku_no', 'item_name', 'item_description', 'serial_no', 'item_price', 'item_qty', 'care_plan', 'care_plan_item', 'line_trans_type', 'location_code', 'parent_item_code']
    for c, v in zip(ref_cols, row):
        print(f"  {c:40s} = {repr(v)}")

conn.close()
