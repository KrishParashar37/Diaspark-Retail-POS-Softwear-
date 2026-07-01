import sys
import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Update pos_orders INSERT
content = content.replace(
    '''INSERT INTO pos_orders (customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status)''',
    '''INSERT INTO pos_orders (customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status, trans_no)'''
)
content = content.replace(
    '''OUTPUT inserted.id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
    '''OUTPUT inserted.id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'''
)
content = content.replace(
    '''(customer_id, salesperson, total_item_amt, total_tax_amt, net_amt, paid_amt, max(0, net_amt - paid_amt), trans_date, 'Pending')''',
    '''(customer_id, salesperson, total_item_amt, total_tax_amt, net_amt, paid_amt, max(0, net_amt - paid_amt), trans_date, 'Pending', final_trans_no)'''
)

# Update pos_order_lines INSERT
content = content.replace(
    '''INSERT INTO pos_order_lines (order_id, sku, serial_no, item_description, item_qty, item_price, subtotal, category, metal_type, metal_color, purity, finish, ring_size, vendor)''',
    '''INSERT INTO pos_order_lines (order_id, sku, serial_no, item_description, item_qty, item_price, subtotal, category, metal_type, metal_color, purity, finish, ring_size, vendor, trans_no)'''
)
content = content.replace(
    '''VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
    '''VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'''
)
content = content.replace(
    '''str(details.get('ring_size', ''))[:50], str(details.get('vendor', ''))[:100])''',
    '''str(details.get('ring_size', ''))[:50], str(details.get('vendor', ''))[:100], final_trans_no)'''
)

# Update pos_order_payments INSERT
content = content.replace(
    '''INSERT INTO pos_order_payments (order_id, payment_type, payment_amt, payment_date)''',
    '''INSERT INTO pos_order_payments (order_id, payment_type, payment_amt, payment_date, trans_no)'''
)
content = content.replace(
    '''VALUES (?, ?, ?, ?)''',
    '''VALUES (?, ?, ?, ?, ?)'''
)
content = content.replace(
    '''(order_id, str(payment.get('type', 'Cash'))[:100], p_amt, trans_date)''',
    '''(order_id, str(payment.get('type', 'Cash'))[:100], p_amt, trans_date, final_trans_no)'''
)

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated app.py to save trans_no")
