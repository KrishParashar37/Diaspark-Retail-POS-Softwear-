import sys
sys.path.append('c:/Users/test/Desktop/DIASPARK UI/backend')
from database import engine
from sqlalchemy import text

conn = engine.connect()

try:
    # Check if pos_orders exists and has columns.
    res = conn.execute(text("SELECT COUNT(*) FROM pos_orders"))
    count = res.fetchone()[0]
    if count == 0:
        print("pos_orders is empty. Copying data from pos_order...")
        # Make sure IDENTITY_INSERT is handled if id is an identity column
        # Or just insert without ID if identity is ON
        try:
            conn.execute(text("SET IDENTITY_INSERT pos_orders ON;"))
            conn.execute(text('''
                INSERT INTO pos_orders (id, order_no, customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status, special_instructions, created_at)
                SELECT id, order_no, customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status, special_instructions, created_at
                FROM pos_order
            '''))
            conn.execute(text("SET IDENTITY_INSERT pos_orders OFF;"))
            conn.commit()
            print("Data copied successfully.")
        except Exception as e:
            print("Failed to copy with identity insert:", e)
except Exception as e:
    print("Error:", e)
