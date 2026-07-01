import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = """        # Map trans_type to 1 char
        mapped_trans_type = trans_type[0].upper() if trans_type else 'S'
        mapped_sales_status = 'C' if paid_amt >= net_amt else 'P'

        if trans_type == 'Special Order':
            # Insert into pos_orders instead of pos_invoices
            cursor.execute(
                '''INSERT INTO pos_orders (customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status)
                   OUTPUT inserted.id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (customer_id, salesperson, total_item_amt, total_tax_amt, net_amt, paid_amt, max(0, net_amt - paid_amt), trans_date, 'Pending')
            )
            order_id = cursor.fetchone()[0]
            custom_trans_no = data.get('transNo')
            final_trans_no = str(custom_trans_no) if custom_trans_no else f"SO-{order_id}"
            cursor.execute("UPDATE pos_orders SET order_no = ? WHERE id = ?", (final_trans_no, order_id))

            for item in items:
                try:
                    qty = float(item.get('qty', 1))
                except:
                    qty = 1.0
                try:
                    price = float(item.get('price', 0))
                except:
                    price = 0.0
                
                details = item.get('specialOrderDetails', {})
                cursor.execute(
                    '''INSERT INTO pos_order_lines (order_id, sku, serial_no, item_description, item_qty, item_price, subtotal, category, metal_type, metal_color, purity, finish, ring_size, vendor)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (order_id, str(item.get('sku', ''))[:100], str(item.get('serial', ''))[:100], 
                     str(item.get('description', ''))[:max(0, len(str(item.get('description', ''))))], 
                     qty, price, qty * price, 
                     str(item.get('category', ''))[:100],
                     str(details.get('metal_type', ''))[:100], str(details.get('metal_color', ''))[:100],
                     str(details.get('purity', ''))[:50], str(details.get('finish', ''))[:50],
                     str(details.get('ring_size', ''))[:50], str(details.get('vendor', ''))[:100])
                )

            for payment in payments:
                try:
                    p_amt = float(payment.get('amount', 0))
                except:
                    p_amt = 0.0
                cursor.execute(
                    '''INSERT INTO pos_order_payments (order_id, payment_type, payment_amt, payment_date)
                       VALUES (?, ?, ?, ?)''',
                    (order_id, str(payment.get('type', 'Cash'))[:100], p_amt, trans_date)
                )

            conn.commit()
            conn.close()
            return jsonify({
                'message': 'Special Order saved successfully in pos_orders',
                'transactionId': order_id,
                'transNo': final_trans_no,
                'itemAmount': total_item_amt,
                'taxAmount': total_tax_amt,
                'netAmount': net_amt,
                'paidAmount': paid_amt
            }), 201
            
        # 1. Insert into pos_invoices"""

content = content.replace("        # Map trans_type to 1 char\n        mapped_trans_type = trans_type[0].upper() if trans_type else 'S'\n        mapped_sales_status = 'C' if paid_amt >= net_amt else 'P'\n\n        # 1. Insert into pos_invoices", new_logic)

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated app.py")
