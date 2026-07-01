import pyodbc
from datetime import datetime

conn = pyodbc.connect(
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)
cursor = conn.cursor()

print("--- Latest Invoices ---")
cursor.execute("SELECT TOP 3 id, trans_date, item_amt, net_amt, item_qty FROM pos_invoices ORDER BY id DESC")
invoices = cursor.fetchall()
for inv in invoices:
    print(f"ID: {inv[0]}, Date: {inv[1]}, Item Amt: {inv[2]}, Net Amt: {inv[3]}, Qty: {inv[4]}")
    
    print("  -- Lines --")
    cursor.execute(f"SELECT TOP 3 catalog_item_code, item_description, item_amt, care_plan, care_plan_item, trans_bk, trans_no FROM pos_invoice_lines WHERE pos_invoice_id = {inv[0]}")
    lines = cursor.fetchall()
    for ln in lines:
        print(f"    Line: {ln}")
        
    print("  -- Payments --")
    cursor.execute(f"SELECT TOP 3 payment_type, payment_amt, trans_bk, trans_no FROM pos_invoice_payments WHERE pos_invoice_id = {inv[0]}")
    payments = cursor.fetchall()
    for pm in payments:
        print(f"    Payment: {pm}")
    print()

conn.close()
