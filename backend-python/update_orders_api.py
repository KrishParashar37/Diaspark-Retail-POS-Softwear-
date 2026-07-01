import sys
with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_orders_api = """@app.route("/api/orders", methods=["GET"])
def get_orders():
    order_type = request.args.get("orderType", "").strip()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # JOIN pos_order with pos_order_lines and Customers
        query = '''
            SELECT 
                o.id,
                o.order_no as special,
                c.lastName as lastName,
                c.firstName as firstName,
                CONVERT(varchar, o.order_date, 101) as orderDate,
                o.salesperson_code as salesPerson,
                o.order_status as currentStage,
                l.sku as item,
                l.item_description as saleDescription,
                l.vendor as vendor
            FROM pos_order o
            LEFT JOIN pos_order_lines l ON o.id = l.order_id
            LEFT JOIN Customers c ON o.customer_id = c.customerId
        '''
        cursor.execute(query)
        
        columns = [column[0] for column in cursor.description]
        data = []
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            data.append(row_dict)
            
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
"""

import re
# Replace the old get_orders
content = re.sub(
    r'@app\.route\("/api/orders", methods=\["GET"\]\)\ndef get_orders\(\):.*?return jsonify\(\{"error": str\(e\)\}\), 500', 
    new_orders_api, 
    content, 
    flags=re.DOTALL
)

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Orders API updated.")
