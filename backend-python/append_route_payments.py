import os

route_code = """
# PAYMENT REPORT
# ════════════════════════════════════════

@app.route('/api/reports/payments', methods=['GET'])
def payments_report():
    try:
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        report_type = request.args.get('reportType', 'Summary')

        conn = get_db_connection()
        cursor = conn.cursor()

        # Helper mapping from raw DB type to Friendly Type
        def map_friendly_type(raw_type):
            raw = str(raw_type).upper()
            if raw == 'CASH': return 'Cash'
            if raw in ('CHCK', 'CHECK'): return 'Check'
            if raw in ('CC', 'CREDIT CARD'): return 'Credit Card'
            if raw == 'GIFT CARD': return 'Gift Certificate'
            if raw == 'FINANCE': return 'Finance'
            if raw == 'ONAC': return 'Store Credit'
            return str(raw_type)

        # Mapping from Friendly Type to tuple of raw DB types for filtering
        type_filters = {
            'Cash': ('CASH',),
            'Check': ('CHCK', 'Check'),
            'Credit Card': ('CC', 'Credit Card'),
            'Gift Certificate': ('Gift Card',),
            'Finance': ('Finance',),
            'Store Credit': ('ONAC',)
        }

        params = []
        base_where = "WHERE 1=1"
        if start_date:
            base_where += " AND CAST(trans_date as DATE) >= ?"
            params.append(start_date)
        if end_date:
            base_where += " AND CAST(trans_date as DATE) <= ?"
            params.append(end_date)

        if report_type == 'Summary':
            # Group by payment_type
            query = f"SELECT payment_type, SUM(payment_amt) as TotalAmount FROM pos_invoice_payments {base_where} GROUP BY payment_type"
            cursor.execute(query, params)
            data = []
            
            # Since multiple raw types can map to one friendly type, we aggregate them in python
            summary_dict = {}
            for row in cursor.fetchall():
                raw_type = row[0]
                amount = float(row[1]) if row[1] else 0.0
                friendly = map_friendly_type(raw_type)
                if friendly not in summary_dict:
                    summary_dict[friendly] = 0.0
                summary_dict[friendly] += amount
            
            for k, v in summary_dict.items():
                data.append({'PaymentType': k, 'TotalAmount': round(v, 2)})
            
            data.sort(key=lambda x: x['TotalAmount'], reverse=True)

        else:
            # Detail or Specific Type
            if report_type != 'Detail' and report_type in type_filters:
                allowed_types = type_filters[report_type]
                placeholders = ','.join(['?'] * len(allowed_types))
                base_where += f" AND payment_type IN ({placeholders})"
                params.extend(allowed_types)

            query = f"SELECT trans_no, trans_date, pos_invoice_id, payment_type, payment_amt, payment_customer_id FROM pos_invoice_payments {base_where} ORDER BY trans_date DESC"
            cursor.execute(query, params)
            columns = [column[0] for column in cursor.description]
            data = []
            for row in cursor.fetchall():
                row_dict = dict(zip(columns, row))
                
                trans_date_str = ""
                if row_dict['trans_date']:
                    trans_date_str = row_dict['trans_date'].strftime('%Y-%m-%d')
                
                data.append({
                    'TransNo': row_dict['trans_no'] or '',
                    'TransDate': trans_date_str,
                    'InvoiceNo': row_dict['pos_invoice_id'] or '',
                    'PaymentType': map_friendly_type(row_dict['payment_type']),
                    'Amount': round(float(row_dict['payment_amt'] or 0.0), 2),
                    'CustomerNo': row_dict['payment_customer_id'] or ''
                })

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print("Error in payments_report:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500
"""

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

if "def payments_report():" not in content:
    with open('app.py', 'a', encoding='utf-8') as f:
        f.write(route_code)
    print("Added payments_report to app.py")
else:
    print("payments_report already exists")
