import sys
sys.path.append('c:/Users/test/Desktop/DIASPARK UI/backend')
from database import engine
from sqlalchemy import text

conn = engine.connect()

# Find foreign keys pointing to pos_order
res = conn.execute(text('''
    SELECT 
        fk.name AS fk_name,
        tp.name AS parent_table
    FROM 
        sys.foreign_keys fk
    INNER JOIN 
        sys.tables tp ON fk.parent_object_id = tp.object_id
    INNER JOIN 
        sys.tables tr ON fk.referenced_object_id = tr.object_id
    WHERE 
        tr.name = 'pos_order'
'''))

fks = res.fetchall()
for fk in fks:
    fk_name = fk[0]
    parent_table = fk[1]
    print(f"Dropping FK {fk_name} from {parent_table}")
    conn.execute(text(f"ALTER TABLE {parent_table} DROP CONSTRAINT {fk_name}"))

# Drop pos_order table
conn.execute(text('DROP TABLE pos_order'))
print('Dropped pos_order table')

# Re-add foreign keys pointing to pos_orders
conn.execute(text('''
    ALTER TABLE pos_order_lines
    ADD CONSTRAINT FK_pos_order_lines_order_id
    FOREIGN KEY (order_id) REFERENCES pos_orders(id)
'''))

conn.execute(text('''
    ALTER TABLE pos_order_payments
    ADD CONSTRAINT FK_pos_order_payments_order_id
    FOREIGN KEY (order_id) REFERENCES pos_orders(id)
'''))

# Create VIEW pos_order
conn.execute(text('CREATE VIEW pos_order AS SELECT * FROM pos_orders'))
conn.commit()

print("Schema fixed successfully! pos_order is now a view of pos_orders.")
