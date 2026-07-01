import io

route = """
@app.route('/api/reports/split-sales-summary', methods=['GET'])
def split_sales_summary():
    try:
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        report_type = request.args.get('reportType', 'Sales Person')

        conn_str = 'Driver={SQL Server Native Client 11.0};Server=DBSRV2025;Database=POSDB;UID=retail;PWD=retail@1234;'
        import pyodbc
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        # Determine grouping column based on reportType
        if report_type == 'Clerk':
            group_col_select = 'i.cashier_code as GroupName'
            group_col = 'i.cashier_code'
        elif report_type == 'Item':
            group_col_select = 'l.item_name as GroupName'
            group_col = 'l.item_name'
        elif report_type == 'State':
            group_col_select = 'i.tax_state as GroupName'
            group_col = 'i.tax_state'
        else: # Default to Sales Person
            group_col_select = 'i.salesperson_name as GroupName'
            group_col = 'i.salesperson_name'

        query = f"SELECT {group_col_select}, SUM(l.net_amt) as NetSales, SUM(l.net_amt - l.item_cost) as Margin FROM pos_invoices i JOIN pos_invoice_lines l ON i.id = l.pos_invoice_id WHERE 1=1"
        params = []

        if start_date and end_date:
            query += " AND CAST(i.trans_date as DATE) >= ? AND CAST(i.trans_date as DATE) <= ?"
            params.extend([start_date, end_date])

        query += f" GROUP BY {group_col} ORDER BY NetSales DESC"

        cursor.execute(query, params)
        columns = [column[0] for column in cursor.description]
        data = []
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            group_name = row_dict['GroupName'] if row_dict['GroupName'] else 'UNKNOWN'
            net_sales = float(row_dict['NetSales']) if row_dict['NetSales'] is not None else 0.0
            margin = float(row_dict['Margin']) if row_dict['Margin'] is not None else 0.0
            margin_pct = (margin / net_sales * 100) if net_sales > 0 else 0.0
            
            data.append({
                'GroupName': group_name,
                'NetSales': round(net_sales, 2),
                'Margin': round(margin, 2),
                'MarginPct': round(margin_pct, 2)
            })

        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print(f"Error generating split sales summary: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
"""

with io.open('app.py', 'a', encoding='utf-8') as f:
    f.write(route)
print("Route appended to app.py")
