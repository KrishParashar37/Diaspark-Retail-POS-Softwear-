import sys
sys.path.append('c:/Users/test/Desktop/DIASPARK UI/backend')
from database import engine
from sqlalchemy import text

conn = engine.connect()

res = conn.execute(text("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '%order%'"))
for row in res.fetchall():
    print(row[0])
