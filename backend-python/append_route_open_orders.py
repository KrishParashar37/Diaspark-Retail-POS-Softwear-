import os

route_code = """
# OPEN ORDER REPORT
# ════════════════════════════════════════

@app.route('/api/reports/open-orders', methods=['GET'])
def open_orders_report():
    try:
        order_start = request.args.get('orderStart')
        order_end = request.args.get('orderEnd')
        customer_start = request.args.get('customerStart')
        customer_end = request.args.get('customerEnd')
        trans_date_start = request.args.get('transDateStart')
        trans_date_end = request.args.get('transDateEnd')

        conn = get_db_connection()
        cursor = conn.cursor()

        params = []
        base_where = "WHERE 1=1"
        
        # Order #
        if order_start and order_end and order_end != 'zzzz':
            base_where += " AND order_no >= ? AND order_no <= ?"
            params.extend([order_start, order_end])
            
        # Customer #
        if customer_start and customer_end and customer_end != 'zzzz':
            base_where += " AND customer_id >= ? AND customer_id <= ?"
            params.extend([customer_start, customer_end])

        # Trans Date (order_date)
        if trans_date_start and trans_date_end:
            base_where += " AND CAST(order_date as DATE) >= ? AND CAST(order_date as DATE) <= ?"
            params.extend([trans_date_start, trans_date_end])
            
        query = f\"\"\"
            SELECT 
                order_no, 
                order_date, 
                customer_id, 
                salesperson_code, 
                net_amt, 
                balance_amt, 
                order_status
            FROM pos_orders 
            {base_where} 
            ORDER BY order_date DESC
        \"\"\"
        cursor.execute(query, params)
        data = []
        for row in cursor.fetchall():
            o_date = row[1].strftime('%Y-%m-%d') if row[1] else ''
            net_amt = float(row[4]) if row[4] else 0.0
            bal_amt = float(row[5]) if row[5] else 0.0
            
            data.append({
                'OrderNo': row[0] or '',
                'OrderDate': o_date,
                'CustomerID': row[2] or '',
                'Salesperson': row[3] or '',
                'NetAmount': round(net_amt, 2),
                'BalanceAmount': round(bal_amt, 2),
                'Status': row[6] or ''
            })

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print("Error in open_orders_report:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500
"""

with open('app.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

main_idx = -1
for i, line in enumerate(lines):
    if line.strip() == 'if __name__ == "__main__":':
        main_idx = i
        break

if main_idx != -1:
    if "def open_orders_report():" not in "".join(lines):
        # Insert before main block
        new_lines = lines[:main_idx] + [route_code, '\n'] + lines[main_idx:]
        with open('app.py', 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("Added open_orders_report to app.py")
    else:
        print("open_orders_report already exists")
else:
    print("Main block not found in app.py")
