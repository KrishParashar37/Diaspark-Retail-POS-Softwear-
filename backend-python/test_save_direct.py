import pyodbc
import traceback

conn_str = (
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)

def test_insert():
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    
    # 1. Test Invoices
    try:
        cursor.execute('''
            INSERT INTO pos_invoices (
                customer_id, salesperson_code, cashier_code, 
                item_amt, tax_per, tax_amt, net_amt, paid_amt, balance_amt,
                sales_category, trans_date, department,
                item_qty, trans_type, sales_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            1, 'Ryan', 'Diaspark Admin(ADMIN)',
            2500, 6.625, 165.625, 2665.625, 2665.625, 0,
            'InHouse', '2026-06-02 12:00:00', 'POS',
            1, 'Sales', 'Completed'
        ))
        cursor.execute("SELECT SCOPE_IDENTITY()")
        transaction_id = cursor.fetchone()[0]
        print("pos_invoices success", transaction_id)
    except Exception as e:
        print("Error pos_invoices:", e)
        conn.rollback()
        return

    # 2. Test Lines
    try:
        cursor.execute('''
            INSERT INTO pos_invoice_lines (
                pos_invoice_id, serial_no, item_description, item_qty, item_price, item_amt,
                tax_per, tax_amt, net_amt, discount_per, discount_amt, trans_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            transaction_id, 'CARE-PLAN-000', 'Care Plan',
            1, 2500, 2500,
            6.625, 165.625, 2500, 0, 0, '2026-06-02 12:00:00'
        ))
        print("pos_invoice_lines success")
    except Exception as e:
        print("Error pos_invoice_lines:", e)
        conn.rollback()
        return
        
    # 3. Test payments
    try:
        cursor.execute('''
            INSERT INTO pos_invoice_payments (
                pos_invoice_id, payment_type, payment_amt, paid_date
            )
            VALUES (?, ?, ?, ?)
        ''', (
            transaction_id, 'Credit Card', 2665.625, '2026-06-02 12:00:00'
        ))
        print("pos_invoice_payments success")
    except Exception as e:
        print("Error pos_invoice_payments:", e)
        conn.rollback()
        return
        
    conn.rollback()
    
test_insert()
