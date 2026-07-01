import sys
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the INSERT INTO pos_orders query to remove trans_no
# We replace the buggy insert with the original one.
old_insert = """            cursor.execute(
                '''INSERT INTO pos_orders (customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status, trans_no)
                   OUTPUT inserted.id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (customer_id, salesperson, total_item_amt, total_tax_amt, net_amt, paid_amt, max(0, net_amt - paid_amt), trans_date, 'Pending', final_trans_no)
            )"""

new_insert = """            cursor.execute(
                '''INSERT INTO pos_orders (customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status)
                   OUTPUT inserted.id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (customer_id, salesperson, total_item_amt, total_tax_amt, net_amt, paid_amt, max(0, net_amt - paid_amt), trans_date, 'Pending')
            )"""

content = content.replace(old_insert, new_insert)

# Now, update the UPDATE statement to set trans_no = final_trans_no
content = content.replace(
    'cursor.execute("UPDATE pos_orders SET order_no = ? WHERE id = ?", (final_trans_no, order_id))',
    'cursor.execute("UPDATE pos_orders SET order_no = ?, trans_no = ? WHERE id = ?", (final_trans_no, final_trans_no, order_id))'
)

# Fix pos_order if rename_back missed something? We know it's pos_orders now.
content = content.replace(
    'cursor.execute("UPDATE pos_order SET order_no = ? WHERE id = ?", (final_trans_no, order_id))',
    'cursor.execute("UPDATE pos_orders SET order_no = ?, trans_no = ? WHERE id = ?", (final_trans_no, final_trans_no, order_id))'
)

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed app.py")
