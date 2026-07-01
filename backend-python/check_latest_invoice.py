import pyodbc

conn = pyodbc.connect(
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)
cursor = conn.cursor()

# Get the latest invoice
cursor.execute("SELECT TOP 1 id, trans_date, net_amt, item_qty FROM pos_invoices ORDER BY id DESC")
invoice = cursor.fetchone()

if invoice:
    print(f"Latest Invoice ID: {invoice[0]}")
    print(f"Transaction Date: {invoice[1]}")
    print(f"Net Amount: {invoice[2]}")
    print(f"Item Quantity: {invoice[3]}")
    print("\n--- Line Items for this Invoice ---")
    
    cursor.execute(f"""
        SELECT id, catalog_item_code, item_description, care_plan, care_plan_item, trans_bk, trans_no 
        FROM pos_invoice_lines 
        WHERE pos_invoice_id = {invoice[0]}
    """)
    
    cols = [c[0] for c in cursor.description]
    for row in cursor.fetchall():
        print(dict(zip(cols, row)))
else:
    print("No invoices found.")

conn.close()
