import os

route_code = """
# TAX REPORT
# ════════════════════════════════════════

@app.route('/api/reports/tax', methods=['GET'])
def tax_report():
    try:
        store_start = request.args.get('storeStart')
        store_end = request.args.get('storeEnd')
        ac_start = request.args.get('acPeriodStart')
        ac_end = request.args.get('acPeriodEnd')
        sales_date_start = request.args.get('salesDateStart')
        sales_date_end = request.args.get('salesDateEnd')
        sales_no_start = request.args.get('salesNoStart')
        sales_no_end = request.args.get('salesNoEnd')
        customer_start = request.args.get('customerStart')
        customer_end = request.args.get('customerEnd')
        report_format = request.args.get('reportFormat', 'By TaxLocation')

        conn = get_db_connection()
        cursor = conn.cursor()

        params = []
        base_where = "WHERE 1=1"
        
        # Store #
        if store_start and store_end:
            base_where += " AND store_code >= ? AND store_code <= ?"
            params.extend([store_start, store_end])
            
        # Sales Date
        if sales_date_start and sales_date_end:
            base_where += " AND CAST(trans_date as DATE) >= ? AND CAST(trans_date as DATE) <= ?"
            params.extend([sales_date_start, sales_date_end])
            
        # Sales # (trans_no)
        if sales_no_start and sales_no_end and sales_no_end != 'zzzz':
            base_where += " AND trans_no >= ? AND trans_no <= ?"
            params.extend([sales_no_start, sales_no_end])
            
        # Customer #
        if customer_start and customer_end and customer_end != 'zzzz':
            base_where += " AND customer_code >= ? AND customer_code <= ?"
            params.extend([customer_start, customer_end])

        if report_format == 'By TaxLocation':
            query = f\"\"\"
                SELECT 
                    tax_state, 
                    tax_code, 
                    SUM(net_amt) as NetSales, 
                    SUM(tax_amt) as TaxAmount
                FROM pos_invoices 
                {base_where} 
                GROUP BY tax_state, tax_code
                ORDER BY tax_state, tax_code
            \"\"\"
            cursor.execute(query, params)
            data = []
            for row in cursor.fetchall():
                t_state = row[0] if row[0] else ''
                t_code = row[1] if row[1] else ''
                net_sales = float(row[2]) if row[2] else 0.0
                tax_amt = float(row[3]) if row[3] else 0.0
                gross_amt = net_sales + tax_amt
                
                data.append({
                    'TaxState': t_state,
                    'TaxCode': t_code,
                    'NetSales': round(net_sales, 2),
                    'TaxAmount': round(tax_amt, 2),
                    'GrossAmount': round(gross_amt, 2)
                })

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print("Error in tax_report:", str(e))
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
    if "def tax_report():" not in "".join(lines):
        # Insert before main block
        new_lines = lines[:main_idx] + [route_code, '\n'] + lines[main_idx:]
        with open('app.py', 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("Added tax_report to app.py")
    else:
        print("tax_report already exists")
else:
    print("Main block not found in app.py")
