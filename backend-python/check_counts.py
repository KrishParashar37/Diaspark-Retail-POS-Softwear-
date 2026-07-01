import sys
sys.path.append('c:/Users/test/Desktop/DIASPARK UI/backend')
from database import engine
from sqlalchemy import text

conn = engine.connect()

print('--- POS_ORDER COUNT ---')
try:
    res = conn.execute(text("SELECT COUNT(*) FROM pos_order"))
    print(res.fetchone())
except Exception as e:
    print(e)

print('--- POS_ORDERS COUNT ---')
try:
    res = conn.execute(text("SELECT COUNT(*) FROM pos_orders"))
    print(res.fetchone())
except Exception as e:
    print(e)
