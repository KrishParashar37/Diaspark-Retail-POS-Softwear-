import pyodbc

conn = pyodbc.connect(
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)
cursor = conn.cursor()

# Get the latest 5 lines
cursor.execute("""
    SELECT TOP 5 id, pos_invoice_id, catalog_item_code, item_description, 
           care_plan, care_plan_item, trans_bk, trans_no 
    FROM pos_invoice_lines 
    ORDER BY id DESC
""")

print("Latest 5 Line Items inserted into DB:\n")
cols = [c[0] for c in cursor.description]
for row in cursor.fetchall():
    print(dict(zip(cols, row)))

conn.close()
