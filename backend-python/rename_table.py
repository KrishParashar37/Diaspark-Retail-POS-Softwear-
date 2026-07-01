import sys
sys.path.append('c:/Users/test/Desktop/DIASPARK UI/backend')
from database import engine
from sqlalchemy import text

conn = engine.connect()

# Rename the table from pos_orders to pos_order in SQL Server using sp_rename
try:
    conn.execute(text("EXEC sp_rename 'pos_orders', 'pos_order';"))
    conn.commit()
    print("Renamed table pos_orders to pos_order successfully.")
except Exception as e:
    print("Error renaming table:", str(e))
    # Maybe it was already renamed, or we can just create pos_order and drop pos_orders.

conn.close()
