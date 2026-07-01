import io

route = """
@app.route('/api/reports/closed-sales', methods=['GET'])
def closed_sales_report():
    try:
        sales_start = request.args.get('salesStart')
        sales_end = request.args.get('salesEnd')
        customer_start = request.args.get('customerStart')
        customer_end = request.args.get('customerEnd')
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        report_type = request.args.get('reportType', 'Sales Report')

        conn = get_db_connection()
        cursor = conn.cursor()

        params = []
        if report_type == 'Sales With Breakup':
            query = \"\"\"
                SELECT 
                    i.trans_no, 
                    CAST(i.trans_date AS DATE) as trans_date, 
                    i.customer_code, 
                    i.net_amt, 
                    i.tax_amt, 
                    (COALESCE(i.net_amt, 0) + COALESCE(i.tax_amt, 0)) as gross_amt,
                    p.payment_type, 
                    p.payment_amt
                FROM pos_invoices i
                LEFT JOIN pos_invoice_payments p ON i.id = p.pos_invoice_id
                WHERE 1=1
            \"\"\"
        else:
            query = \"\"\"
                SELECT 
                    i.trans_no, 
                    CAST(i.trans_date AS DATE) as trans_date, 
                    i.customer_code, 
                    i.net_amt, 
                    i.tax_amt, 
                    (COALESCE(i.net_amt, 0) + COALESCE(i.tax_amt, 0)) as gross_amt
                FROM pos_invoices i
                WHERE 1=1
            \"\"\"

        if sales_start and sales_end:
            query += " AND i.trans_no >= ? AND i.trans_no <= ?"
            params.extend([sales_start, sales_end])
            
        if customer_start and customer_end:
            query += " AND i.customer_code >= ? AND i.customer_code <= ?"
            params.extend([customer_start, customer_end])

        if start_date and end_date:
            query += " AND CAST(i.trans_date as DATE) >= ? AND CAST(i.trans_date as DATE) <= ?"
            params.extend([start_date, end_date])

        query += " ORDER BY i.trans_no DESC"

        cursor.execute(query, params)
        columns = [column[0] for column in cursor.description]
        data = []
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            # Format numbers properly
            for k in ['net_amt', 'tax_amt', 'gross_amt', 'payment_amt']:
                if k in row_dict:
                    row_dict[k] = float(row_dict[k]) if row_dict[k] is not None else 0.0
            
            # Format dates
            if 'trans_date' in row_dict and row_dict['trans_date']:
                row_dict['trans_date'] = row_dict['trans_date'].strftime('%Y-%m-%d')
                
            data.append(row_dict)

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print(f"Error generating closed sales report: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
"""

with io.open('app.py', 'a', encoding='utf-8') as f:
    f.write(route)
print("Route appended to app.py")
