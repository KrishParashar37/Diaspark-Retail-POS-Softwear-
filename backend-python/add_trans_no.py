import sys
sys.path.append('c:/Users/test/Desktop/DIASPARK UI/backend')
from database import engine
from sqlalchemy import text

conn = engine.connect()

try:
    conn.execute(text("ALTER TABLE pos_orders ADD trans_no VARCHAR(50)"))
    conn.commit()
    print("Added trans_no to pos_orders")
except Exception as e:
    print(e)

try:
    conn.execute(text("ALTER TABLE pos_order_lines ADD trans_no VARCHAR(50)"))
    conn.commit()
    print("Added trans_no to pos_order_lines")
except Exception as e:
    print(e)

try:
    conn.execute(text("ALTER TABLE pos_order_payments ADD trans_no VARCHAR(50)"))
    conn.commit()
    print("Added trans_no to pos_order_payments")
except Exception as e:
    print(e)
