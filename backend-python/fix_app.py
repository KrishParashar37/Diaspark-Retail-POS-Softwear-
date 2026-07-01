import re

with open('backend-python/app.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = '''@app.route('/api/repairs', methods=['POST'])
def save_repair():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()

        order_date = datetime.now()
        
        # Use existing order_no if provided, otherwise generate one
        order_no = data.get('order_no', f"REP-{int(order_date.timestamp())}")
        
        # We will use order_no as the trans_no across all tables for repairs
        trans_no = data.get('trans_no') or order_no

        cursor.execute(
            """
            INSERT INTO pos_orders
            (order_no, customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status, special_instructions, created_at, trans_no)
            OUTPUT inserted.id
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                order_no,
                data.get('customer_id', 1),
                data.get('salesperson', 'DEMO'),
                float(data.get('item_amt', 0)),
                float(data.get('tax_amt', 0)),
                float(data.get('net_amt', 0)),
                float(data.get('paid_amt', 0)),
                float(data.get('balance_amt', 0)),
                order_date,
                'REPAIR',
                data.get('special_instructions', ''),
                order_date,
                trans_no
            )
        )
        order_id = cursor.fetchone()[0]

        repair_rows = data.get('repairRows', [])
        for row in repair_rows:
            cursor.execute(
                """
                INSERT INTO pos_order_lines
                (order_id, sku, item_description, item_qty, item_price, subtotal, category, vendor, metal_type, metal_color, purity, finish, ring_size, trans_no)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    order_id,
                    row.get('laborNo', 'REPAIR')[:100],
                    row.get('desc', 'Repair Labor')[:100],
                    int(row.get('qty', 1)),
                    float(row.get('price', 0)),
                    float(row.get('ext', 0)),
                    row.get('category', '')[:100],
                    data.get('vendor', '')[:100],
                    data.get('metal_type', '')[:100],
                    data.get('metal_color', '')[:100],
                    data.get('purity', '')[:50],
                    data.get('finish', '')[:50],
                    data.get('ring_size', '')[:50],
                    trans_no[:100]
                )
            )

        cursor.execute(
            """
            INSERT INTO pos_order_payments
            (order_id, payment_type, payment_amt, payment_date, trans_no)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                order_id,
                'DEPOSIT',
                float(data.get('paid_amt', 0)),
                order_date,
                trans_no[:100]
            )
        )

        conn.commit()
        conn.close()
        return jsonify({'message': 'Repair saved successfully', 'order_id': order_id, 'trans_no': trans_no}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/db/repair_orders', methods=['GET'])
def get_repair_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM pos_orders WHERE order_status = 'REPAIR'")
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/db/repair_lines', methods=['GET'])
def get_repair_lines():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT l.* FROM pos_order_lines l JOIN pos_orders o ON l.order_id = o.id WHERE o.order_status = 'REPAIR'")
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/db/repair_payments', methods=['GET'])
def get_repair_payments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT p.* FROM pos_order_payments p JOIN pos_orders o ON p.order_id = o.id WHERE o.order_status = 'REPAIR'")
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
'''

start_idx = content.find("@app.route('/api/repairs', methods=['POST'])")
if start_idx != -1:
    end_pattern = "return jsonify({'error': str(e)}), 500"
    end_idx = content.find(end_pattern, start_idx) + len(end_pattern)
    
    final_content = content[:start_idx] + new_logic + content[end_idx:]
    with open('backend-python/app.py', 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("Successfully replaced the repair logic")
else:
    print("Could not find the target string")
